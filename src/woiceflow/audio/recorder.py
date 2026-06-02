import queue
import numpy as np
import sounddevice as sd
from loguru import logger

class AudioRecorder:
    """Handles thread-safe audio recording from a microphone using sounddevice."""

    def __init__(self, sample_rate: int = 16000, channels: int = 1, device: int | str | None = None, on_amplitude = None):
        self.sample_rate = sample_rate
        self.channels = channels
        self.device = device
        self.audio_queue = queue.Queue()
        self.stream = None
        self.is_recording = False
        self.on_amplitude = on_amplitude

    def _audio_callback(self, indata: np.ndarray, frames: int, time_info: dict, status: sd.CallbackFlags) -> None:
        """This callback is called for each audio block by sounddevice."""
        if status:
            logger.warning(f"Sounddevice callback status warning: {status}")
        
        # Put a copy of the input data into the queue
        self.audio_queue.put(indata.copy())

        # Invoke the amplitude callback if provided
        if self.on_amplitude and len(indata) > 0:
            peak = float(np.max(np.abs(indata)))
            self.on_amplitude(peak)

    def start_recording(self) -> bool:
        """Starts recording audio from the microphone."""
        if self.is_recording:
            logger.warning("Recording is already in progress.")
            return True

        # Clear any leftover data in the queue
        while not self.audio_queue.empty():
            try:
                self.audio_queue.get_nowait()
            except queue.Empty:
                break

        logger.info(f"Starting audio recording at {self.sample_rate}Hz, channels={self.channels}...")
        try:
            self.stream = sd.InputStream(
                samplerate=self.sample_rate,
                channels=self.channels,
                dtype="float32",
                callback=self._audio_callback,
                device=self.device
            )
            self.stream.start()
            self.is_recording = True
            logger.success("Recording started successfully.")
            return True
        except Exception as e:
            logger.error(f"Failed to start audio recording stream: {e}")
            self.stream = None
            self.is_recording = False
            return False

    def stop_recording(self) -> np.ndarray:
        """Stops the audio recording and returns the accumulated audio data."""
        if not self.is_recording or self.stream is None:
            logger.warning("Stop requested but recorder is not active.")
            return np.zeros(0, dtype=np.float32)

        logger.info("Stopping audio recording...")
        self.is_recording = False

        try:
            self.stream.stop()
            self.stream.close()
        except Exception as e:
            logger.error(f"Error while closing audio stream: {e}")
        finally:
            self.stream = None

        # Fetch and concatenate all chunks from the queue
        chunks = []
        while not self.audio_queue.empty():
            try:
                chunks.append(self.audio_queue.get_nowait())
            except queue.Empty:
                break

        if not chunks:
            logger.warning("No audio data recorded.")
            return np.zeros(0, dtype=np.float32)

        # Concatenate and flatten to a 1D array since channels = 1
        audio_data = np.concatenate(chunks, axis=0)
        
        # If stereo, convert to mono by averaging channels
        if audio_data.ndim > 1 and audio_data.shape[1] > 1:
            audio_data = np.mean(audio_data, axis=1)
        else:
            audio_data = audio_data.flatten()

        logger.success(f"Recording stopped. Captured {len(audio_data) / self.sample_rate:.2f} seconds of audio.")
        return audio_data
