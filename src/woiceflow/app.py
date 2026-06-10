import sys
import os

# On Linux under a Wayland compositor, force Qt to use the XWayland (xcb) backend.
# This ensures frameless window flags, translucency, click-through, and stays-on-top
# all work reliably via XWayland. We only apply this when:
#   - The platform is Linux
#   - The session is Wayland (WAYLAND_DISPLAY is set)
#   - The user hasn't already overridden QT_QPA_PLATFORM themselves
# On X11-only, macOS, and Windows we leave Qt's default platform plugin alone.
if sys.platform.startswith("linux"):
    if os.environ.get("WAYLAND_DISPLAY") and not os.environ.get("QT_QPA_PLATFORM"):
        os.environ["QT_QPA_PLATFORM"] = "xcb"

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import socket
import time
import threading
from loguru import logger
from rich.console import Console

from woiceflow.audio.recorder import AudioRecorder
from woiceflow.speech.whisper_engine import WhisperEngine
from woiceflow.injector.typer import TextInjector
from woiceflow.hotkeys.listener import HotkeyListener

import json

class IPCServer:
    """Listens on local sockets to communicate with frontends (Wayland & Windows compatibility)."""

    def __init__(self, callback, socket_path: str | None = None, port: int = 17005):
        self.callback = callback
        try:
            uid = os.getuid()
        except AttributeError:
            uid = 1000
        runtime_dir = os.environ.get("XDG_RUNTIME_DIR", f"/run/user/{uid}")
        self.socket_path = socket_path or os.path.join(runtime_dir, "woiceflow.socket")
        self.port = port
        self.server_socket = None
        self.running = False
        self.clients = []
        self.clients_lock = threading.Lock()

    def start(self) -> None:
        """Starts the local socket server in a daemon thread."""
        self.running = True
        threading.Thread(target=self._listen_loop, daemon=True).start()

    def _listen_loop(self) -> None:
        is_windows = os.name == 'nt'
        try:
            if is_windows:
                # On Windows, we use a localhost TCP socket
                self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
                self.server_socket.bind(('127.0.0.1', self.port))
                logger.info(f"IPC Server started on TCP port {self.port} (Windows mode)")
            else:
                # On Linux/macOS, we use a Unix Domain Socket
                if os.path.exists(self.socket_path):
                    try:
                        os.unlink(self.socket_path)
                    except OSError:
                        pass
                self.server_socket = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
                self.server_socket.bind(self.socket_path)
                logger.info(f"IPC Server started on Unix socket {self.socket_path}")

            self.server_socket.listen(5)

            while self.running:
                try:
                    conn, _ = self.server_socket.accept()
                    threading.Thread(target=self._handle_client, args=(conn,), daemon=True).start()
                except Exception as e:
                    if self.running:
                        logger.debug(f"Accept error in socket server: {e}")
        except Exception as e:
            logger.error(f"Failed to start IPC Server: {e}")

    def _handle_client(self, conn) -> None:
        with self.clients_lock:
            self.clients.append(conn)

        logger.debug("New IPC client connected.")
        buffer = b""
        try:
            while self.running:
                data = conn.recv(4096)
                if not data:
                    break
                buffer += data
                while b"\n" in buffer:
                    line, buffer = buffer.split(b"\n", 1)
                    line_str = line.decode('utf-8').strip()
                    if line_str == "toggle":
                        logger.debug("Received toggle command via IPC.")
                        self.callback()
                
                # Support legacy connection closing trigger (like toggle.py does)
                if buffer == b"toggle":
                    logger.debug("Received legacy toggle signal via IPC.")
                    self.callback()
                    buffer = b""
        except OSError as e:
            if e.errno != 9:
                logger.debug(f"IPC client connection exception: {e}")
        except Exception as e:
            logger.debug(f"IPC client connection exception: {e}")
        finally:
            with self.clients_lock:
                if conn in self.clients:
                    self.clients.remove(conn)
            try:
                conn.close()
            except Exception:
                pass
            logger.debug("IPC client disconnected.")

    def broadcast(self, event: str, data: any = None) -> None:
        """Sends a JSON-encoded event string ending with newline to all connected clients."""
        payload = json.dumps({"event": event, "data": data}) + "\n"
        payload_bytes = payload.encode('utf-8')

        with self.clients_lock:
            disconnected_clients = []
            for client in self.clients:
                try:
                    client.sendall(payload_bytes)
                except Exception:
                    disconnected_clients.append(client)

            for client in disconnected_clients:
                if client in self.clients:
                    self.clients.remove(client)
                    try:
                        client.close()
                    except Exception:
                        pass

    def stop(self) -> None:
        """Stops the IPC server and cleans up resource handles."""
        self.running = False
        if self.server_socket:
            try:
                self.server_socket.close()
            except Exception:
                pass
            self.server_socket = None

        with self.clients_lock:
            for client in self.clients:
                try:
                    client.close()
                except Exception:
                    pass
            self.clients.clear()

        if os.name != 'nt' and os.path.exists(self.socket_path):
            try:
                os.unlink(self.socket_path)
            except OSError:
                pass
        logger.info("IPC Server stopped and socket cleaned up.")


from woiceflow.ui.overlay import DictationHUD, HUDController, PYQT_AVAILABLE, QApplication, QTimer

class WoiceFlowApp:
    """Main application coordinating hotkey listener, recorder, transcription, and injection."""

    def __init__(self):
        self.console = Console()
        self.recorder = AudioRecorder(on_amplitude=self._on_amplitude)
        self.engine = WhisperEngine()
        self.injector = TextInjector()
        
        # State machine: "idle", "recording", "transcribing"
        self.state = "idle"
        self.state_lock = threading.Lock()
        
        # Wayland-compatible Unix socket server for global hotkey simulation
        self.ipc_server = IPCServer(callback=self.toggle_recording)
        
        # Standard pynput listener (works natively on X11 / XWayland / active window)
        self.listener = HotkeyListener(hotkey_str="<f9>", on_trigger=self.toggle_recording)

        # Initialize GUI Overlay if PyQt6 is available
        self.use_gui = PYQT_AVAILABLE
        self.hud = None
        self.hud_controller = None
        
        if self.use_gui:
            self.qt_app = QApplication.instance()
            if not self.qt_app:
                self.qt_app = QApplication(sys.argv)
            self.qt_app.setQuitOnLastWindowClosed(False)
            self.hud = DictationHUD()
            self.hud_controller = HUDController(self.hud)

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
        
        if self.use_gui:
            # Handle SIGINT (Ctrl+C) gracefully in PyQt6
            import signal
            def sigint_handler(*args):
                logger.info("SIGINT received. Shutting down...")
                self.listener.stop()
                self.ipc_server.stop()
                if self.hud:
                    self.hud.close()
                QApplication.quit()
                sys.exit(0)
            
            signal.signal(signal.SIGINT, sigint_handler)
            
            # Setup a timer to periodically yield control to the Python interpreter so it can catch signals
            self.sig_timer = QTimer()
            self.sig_timer.start(200)
            self.sig_timer.timeout.connect(lambda: None)
            
            logger.info("Starting PyQt6 Event Loop...")
            self.qt_app.exec()
        else:
            # Fallback to CLI event loop
            try:
                while True:
                    time.sleep(0.5)
            except KeyboardInterrupt:
                self.console.print("\n[yellow]Shutting down WoiceFlow...[/yellow]")
                self.listener.stop()
                self.ipc_server.stop()
                self.console.print("[bold green]Goodbye![/bold green]")

    def _on_amplitude(self, amplitude: float) -> None:
        """Callback from AudioRecorder when new audio frame is captured."""
        with self.state_lock:
            if self.state == "recording":
                self.ipc_server.broadcast("AmplitudeUpdated", {"amplitude": amplitude})
                if self.use_gui and self.hud_controller:
                    self.hud_controller.update_amplitude(amplitude)

    def toggle_recording(self) -> None:
        """Toggles the recording state. Thread-safe callback from HotkeyListener or IPC socket."""
        with self.state_lock:
            if self.state == "idle":
                # Transition to recording
                if self.recorder.start_recording():
                    self.state = "recording"
                    self.console.print("\n[bold red]🔴 Recording... Speak now. Press F9 to finish.[/bold red]")
                    self.ipc_server.broadcast("RecordingStarted")
                    if self.use_gui:
                        self.hud_controller.update_hud("recording", "🎙️ Recording...")
            elif self.state == "recording":
                # Transition to transcribing
                self.state = "transcribing"
                self.console.print("[bold yellow]⏳ Stopped recording. Processing audio...[/bold yellow]")
                self.ipc_server.broadcast("RecordingStopped")
                self.ipc_server.broadcast("TranscribingStarted")
                if self.use_gui:
                    self.hud_controller.update_hud("transcribing", "⏳ Processing...")
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
                self.ipc_server.broadcast("ErrorOccurred", {"message": "No audio data captured."})
                if self.use_gui:
                    self.hud_controller.update_hud("error", "❌ No audio data captured.", 2500)
                return

            import numpy as np
            peak_volume = float(np.max(np.abs(audio_data)))
            self.console.print(f"[dim]Audio volume check: Peak amplitude is {peak_volume:.4f}[/dim]")
            
            # Save audio to a debug WAV file in the root workspace
            import wave
            try:
                # Scale float32 to 16-bit integer
                int_data = (audio_data * 32767).astype(np.int16)
                wav_path = os.path.join(PROJECT_ROOT, "last_recording.wav")
                with wave.open(wav_path, "wb") as wf:
                    wf.setnchannels(1)
                    wf.setsampwidth(2)
                    wf.setframerate(self.recorder.sample_rate)
                    wf.writeframes(int_data.tobytes())
                logger.debug(f"Saved debug recording to {wav_path}")
            except Exception as e:
                logger.error(f"Failed to save debug recording: {e}")

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
                self.ipc_server.broadcast("ErrorOccurred", {"message": "No speech recognized."})
                if self.use_gui:
                    self.hud_controller.update_hud("error", "❌ No speech recognized.", 2500)
                return

            self.console.print(f"[bold green]✨ Dictated:[/bold green] \"[italic]{transcript}[/italic]\"")
            self.ipc_server.broadcast("TranscribingFinished", {"text": transcript})
            if self.use_gui:
                # Truncate for overlay display if it's too long
                display_text = transcript if len(transcript) < 40 else f"{transcript[:37]}..."
                self.hud_controller.update_hud("success", f"✨ {display_text}", 2500)
            
            self.console.print("[bold blue]⌨️ Injecting text into active window...[/bold blue]")
            success = self.injector.inject(transcript)
            
            if success:
                self.console.print("[bold green]✅ Text injected successfully![/bold green]")
            else:
                self.console.print(
                    "[bold red]❌ Injection failed. Please check if the 'ydotoold' daemon is running "
                    "and accessible.[/bold red]"
                )
                self.ipc_server.broadcast("ErrorOccurred", {"message": "Text injection failed."})
                if self.use_gui:
                    self.hud_controller.update_hud("error", "❌ Injection failed! 😢", 2500)
                
        except Exception as e:
            logger.exception(f"Unhandled error in transcription pipeline: {e}")
            self.console.print(f"[bold red]❌ An error occurred: {e}[/bold red]")
            self.ipc_server.broadcast("ErrorOccurred", {"message": str(e)})
            if self.use_gui:
                self.hud_controller.update_hud("error", f"❌ Error: {e}", 2500)
        finally:
            with self.state_lock:
                self.state = "idle"
                self.console.print("\n[bold green]Ready! Press F9 to record.[/bold green]")

def load_dotenv() -> None:
    """Simple in-house dotenv loader to set environment variables from a .env file."""
    import os
    env_path = os.path.join(PROJECT_ROOT, ".env")
    if os.path.exists(env_path):
        try:
            with open(env_path, "r") as f:
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
            logger.info(f"Loaded environment variables from {env_path}")
        except Exception as e:
            logger.warning(f"Failed to load environment variables from {env_path}: {e}")

def main():
    import sys
    load_dotenv()
    
    if "--toggle" in sys.argv:
        import socket
        try:
            uid = os.getuid()
        except AttributeError:
            uid = 1000
        runtime_dir = os.environ.get("XDG_RUNTIME_DIR", f"/run/user/{uid}")
        socket_path = os.path.join(runtime_dir, "woiceflow.socket")
        
        is_windows = os.name == 'nt'
        if is_windows:
            port = 17005
            try:
                client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                client.connect(('127.0.0.1', port))
                client.sendall(b"toggle\n")
                client.close()
                print("🎙️ WoiceFlow toggle signal sent via TCP!")
                sys.exit(0)
            except Exception:
                pass
        else:
            try:
                client = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
                client.connect(socket_path)
                client.sendall(b"toggle")
                client.close()
                print("🎙️ WoiceFlow toggle signal sent via Unix Socket!")
                sys.exit(0)
            except Exception:
                pass

    app = WoiceFlowApp()
    app.start()

if __name__ == "__main__":
    main()
