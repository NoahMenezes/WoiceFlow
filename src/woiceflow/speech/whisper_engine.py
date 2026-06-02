import os
import numpy as np
from loguru import logger
from faster_whisper import WhisperModel

class WhisperEngine:
    """Handles speech-to-text transcription using Faster-Whisper."""

    def __init__(
        self,
        model_size: str = "base",
        device: str = "cpu",
        compute_type: str = "int8",
        download_root: str | None = None,
    ):
        self.model_size = model_size
        self.device = device
        self.compute_type = compute_type
        self.download_root = download_root
        self._model = None

    def load_model(self) -> None:
        """Loads the Faster-Whisper model into memory."""
        if self._model is not None:
            return

        logger.info(
            f"Loading Faster-Whisper model '{self.model_size}' on '{self.device}' "
            f"with compute type '{self.compute_type}'..."
        )
        try:
            # Initialize WhisperModel
            self._model = WhisperModel(
                self.model_size,
                device=self.device,
                compute_type=self.compute_type,
                download_root=self.download_root
            )
            logger.success(f"Faster-Whisper model '{self.model_size}' loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load Faster-Whisper model: {e}")
            raise

    def transcribe(self, audio_data: np.ndarray, sample_rate: int = 16000) -> str:
        """
        Transcribes the input audio data (numpy array).
        Expects single-channel (mono) float32 audio at the specified sample rate (ideally 16000 Hz).
        """
        if self._model is None:
            self.load_model()

        # Ensure the model is loaded (for type checkers)
        assert self._model is not None

        logger.info(f"Starting transcription of {len(audio_data) / sample_rate:.2f}s of audio...")

        try:
            # transcribe expects a 1D float32 numpy array or filename
            # We can pass raw audio data directly
            segments, info = self._model.transcribe(
                audio_data,
                beam_size=5,
                language="en",  # Default to English for better latency, or auto-detect if None
                vad_filter=True,  # Use Voice Activity Detection to filter out silence/noise
                vad_parameters=dict(min_silence_duration_ms=500)
            )

            # Join segments
            text_segments = []
            for segment in segments:
                text_segments.append(segment.text)
                logger.debug(f"Transcribed segment: [{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text!r}")

            full_text = "".join(text_segments).strip()
            logger.info(f"Transcription finished. Result: {full_text!r}")
            return full_text
        except Exception as e:
            logger.exception(f"Error during transcription: {e}")
            return ""
