import sys
import time
import threading
from loguru import logger
from rich.console import Console

from woiceflow.audio.recorder import AudioRecorder
from woiceflow.speech.whisper_engine import WhisperEngine
from woiceflow.injector.typer import TextInjector
from woiceflow.hotkeys.listener import HotkeyListener

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
        
        # Listen for global F9 press
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
            
        # Start hotkey listener
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
