import sys
import os
import socket
import time
import threading
from loguru import logger
from rich.console import Console

from woiceflow.audio.recorder import AudioRecorder
from woiceflow.speech.whisper_engine import WhisperEngine
from woiceflow.injector.typer import TextInjector
from woiceflow.hotkeys.listener import HotkeyListener

class IPCServer:
    """Listens on a local Unix socket to receive recording toggle triggers (Wayland compatibility)."""

    def __init__(self, callback, socket_path: str = "/run/user/1000/woiceflow.socket"):
        self.callback = callback
        self.socket_path = socket_path
        self.server_socket = None
        self.running = False

    def start(self) -> None:
        """Starts the local Unix socket server in a daemon thread."""
        if os.path.exists(self.socket_path):
            try:
                os.unlink(self.socket_path)
            except OSError:
                pass

        try:
            self.server_socket = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
            self.server_socket.bind(self.socket_path)
            self.server_socket.listen(1)
            self.running = True
            threading.Thread(target=self._listen_loop, daemon=True).start()
            logger.info(f"IPC Server started on {self.socket_path}")
        except Exception as e:
            logger.error(f"Failed to start IPC Server: {e}")

    def _listen_loop(self) -> None:
        """Listens for connections and calls callback when 'toggle' message is received."""
        while self.running:
            try:
                conn, _ = self.server_socket.accept()
                with conn:
                    data = conn.recv(1024)
                    if data == b"toggle":
                        logger.debug("Received toggle signal via IPC socket.")
                        self.callback()
            except Exception as e:
                if self.running:
                    logger.debug(f"IPC connection exception: {e}")

    def stop(self) -> None:
        """Stops the IPC server and cleans up the socket file."""
        self.running = False
        if self.server_socket:
            try:
                self.server_socket.close()
            except Exception:
                pass
            self.server_socket = None
        if os.path.exists(self.socket_path):
            try:
                os.unlink(self.socket_path)
            except OSError:
                pass
        logger.info("IPC Server stopped and socket cleaned up.")


class WoiceFlowApp:
    """Main application coordinating hotkey listener, recorder, transcription, and injection."""

    def __init__(self):
        self.console = Console()
        self.recorder = AudioRecorder()
        self.engine = WhisperEngine()
        self.injector = TextInjector()
        
        # State machine: "idle", "recording", "transcribing"
        self.state = "idle"
        self.state_lock = threading.Lock()
        
        # Wayland-compatible Unix socket server for global hotkey simulation
        self.ipc_server = IPCServer(callback=self.toggle_recording)
        
        # Standard pynput listener (works natively on X11 / XWayland / active window)
        self.listener = HotkeyListener(hotkey_str="<f9>", on_trigger=self.toggle_recording)

    def start(self) -> None:
        """Starts the application, pre-loads the model, and enters the main loop."""
        self.console.print("[bold green]Starting WoiceFlow Voice Dictation...[/bold green]")
        
        # Pre-load the Faster-Whisper model on startup to avoid latency on first trigger
        self.console.print("[yellow]Pre-loading Faster-Whisper model (this might take a few seconds)...[/yellow]")
        try:
            self.engine.load_model()
        except Exception as e:
            self.console.print(f"[bold red]Critical Error: Failed to load speech recognition model. {e}[/bold red]")
            sys.exit(1)
            
        # Start IPC Server for Wayland compatibility
        self.ipc_server.start()

        # Start standard hotkey listener
        self.listener.start()
        
        self.console.print("\n[bold green]🚀 WoiceFlow is active and running![/bold green]")
        self.console.print("  • Press [bold cyan]F9[/bold cyan] to start recording.")
        self.console.print("  • Speak your text.")
        self.console.print("  • Press [bold cyan]F9[/bold cyan] again to stop, transcribe, and inject.")
        self.console.print("  • Press [bold red]Ctrl+C[/bold red] in this terminal to quit.\n")
        
        try:
            while True:
                time.sleep(0.5)
        except KeyboardInterrupt:
            self.console.print("\n[yellow]Shutting down WoiceFlow...[/yellow]")
            self.listener.stop()
            self.ipc_server.stop()
            self.console.print("[bold green]Goodbye![/bold green]")

    def toggle_recording(self) -> None:
        """Toggles the recording state. Thread-safe callback from HotkeyListener."""
        with self.state_lock:
            if self.state == "idle":
                # Transition to recording
                if self.recorder.start_recording():
                    self.state = "recording"
                    self.console.print("\n[bold red]🔴 Recording... Speak now. Press F9 to finish.[/bold red]")
            elif self.state == "recording":
                # Transition to transcribing
                self.state = "transcribing"
                self.console.print("[bold yellow]⏳ Stopped recording. Processing audio...[/bold yellow]")
                # Run transcription & injection in a background thread to keep hotkey thread responsive
                threading.Thread(target=self._process_and_inject, daemon=True).start()
            elif self.state == "transcribing":
                self.console.print("[yellow]⚠️ Transcription in progress. Please wait...[/yellow]")

    def _process_and_inject(self) -> None:
        """Processes the recorded audio, transcribes it, and injects the text."""
        try:
            # Retrieve the raw recorded audio data
            audio_data = self.recorder.stop_recording()
            
            if audio_data is None or len(audio_data) == 0:
                self.console.print("[bold red]❌ No audio data captured.[/bold red]")
                return

            import numpy as np
            peak_volume = float(np.max(np.abs(audio_data)))
            self.console.print(f"[dim]Audio volume check: Peak amplitude is {peak_volume:.4f}[/dim]")
            
            # Save audio to a debug WAV file in the root workspace
            import wave
            try:
                # Scale float32 to 16-bit integer
                int_data = (audio_data * 32767).astype(np.int16)
                with wave.open("last_recording.wav", "wb") as wf:
                    wf.setnchannels(1)
                    wf.setsampwidth(2)
                    wf.setframerate(self.recorder.sample_rate)
                    wf.writeframes(int_data.tobytes())
                logger.debug("Saved debug recording to last_recording.wav")
            except Exception as e:
                logger.error(f"Failed to save last_recording.wav: {e}")

            if peak_volume < 0.005:
                self.console.print(
                    "[bold yellow]⚠️ Warning: The recording is silent or extremely quiet (peak: "
                    f"{peak_volume:.4f}). Check if your microphone is muted or if "
                    "the wrong input device is selected in your system settings![/bold yellow]"
                )
                self.console.print(
                    "[dim]Hint: Play 'last_recording.wav' in the project directory to hear what was captured.[/dim]"
                )

            self.console.print("[bold blue]🎙️ Transcribing speech...[/bold blue]")
            transcript = self.engine.transcribe(audio_data)
            
            if not transcript:
                self.console.print("[bold red]❌ No speech recognized.[/bold red]")
                return

            self.console.print(f"[bold green]✨ Dictated:[/bold green] \"[italic]{transcript}[/italic]\"")
            
            self.console.print("[bold blue]⌨️ Injecting text into active window...[/bold blue]")
            success = self.injector.inject(transcript)
            
            if success:
                self.console.print("[bold green]✅ Text injected successfully![/bold green]")
            else:
                self.console.print(
                    "[bold red]❌ Injection failed. Please check if the 'ydotoold' daemon is running "
                    "and accessible.[/bold red]"
                )
                
        except Exception as e:
            logger.exception(f"Unhandled error in transcription pipeline: {e}")
            self.console.print(f"[bold red]❌ An error occurred: {e}[/bold red]")
        finally:
            with self.state_lock:
                self.state = "idle"
                self.console.print("\n[bold green]Ready! Press F9 to record.[/bold green]")

def load_dotenv() -> None:
    """Simple in-house dotenv loader to set environment variables from a .env file."""
    import os
    if os.path.exists(".env"):
        try:
            with open(".env", "r") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        key, val = line.split("=", 1)
                        key = key.strip()
                        val = val.strip().strip("'\"")
                        os.environ[key] = val
                        # Standardize Hugging Face token env variables
                        if key in ("HUGGINGFACE_ACCESS_TOKEN", "HF_TOKEN"):
                            os.environ["HF_TOKEN"] = val
                            os.environ["HUGGINGFACE_ACCESS_TOKEN"] = val
            logger.info("Loaded environment variables from .env file.")
        except Exception as e:
            logger.warning(f"Failed to load .env file: {e}")

def main():
    load_dotenv()
    app = WoiceFlowApp()
    app.start()

if __name__ == "__main__":
    main()
