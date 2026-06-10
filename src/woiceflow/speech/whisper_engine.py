import os
import numpy as np
from loguru import logger
from faster_whisper import WhisperModel

class WhisperEngine:
    """Handles speech-to-text transcription using Faster-Whisper."""

    def __init__(
        self,
        model_size: str | None = None,
        device: str | None = None,
        compute_type: str | None = None,
        download_root: str | None = None,
    ):
        import os
        self.model_size = model_size or os.getenv("WOICEFLOW_MODEL_SIZE", "base")
        self.device = device or os.getenv("WOICEFLOW_DEVICE", "cpu")
        self.compute_type = compute_type or os.getenv("WOICEFLOW_COMPUTE_TYPE", "int8")
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

    def _correct_typos(self, text: str) -> str:
        """Corrects common dictation and spelling mistakes for technical terms."""
        if not text:
            return text

        import re
        
        # Dictionary of lowercase spelling/typo patterns to correct capitalized versions
        corrections = {
            r"\bnext\s*js\b": "Next.js",
            r"\btypescript\b": "TypeScript",
            r"\bjavascript\b": "JavaScript",
            r"\btailwind\s*css\b": "Tailwind CSS",
            r"\btailwind\b": "Tailwind",
            r"\bgithub\b": "GitHub",
            r"\bvs\s*code\b": "VS Code",
            r"\by\s*do\s*tool\b": "ydotool",
            r"\bydotool\b": "ydotool",
            r"\bvoice\s*flow\b": "WoiceFlow",
            r"\bwoiceflow\b": "WoiceFlow",
            r"\bpyqt\s*6\b": "PyQt6",
            r"\bpyqt\b": "PyQt6",
            r"\bpython\b": "Python",
            r"\bfedora\b": "Fedora",
            r"\bwayland\b": "Wayland",
            r"\bgnome\b": "GNOME",
            r"\bchat\s*gpt\b": "ChatGPT",
            r"\bapi\b": "API",
            r"\bapis\b": "APIs",
            r"\bui\b": "UI",
        }
        
        corrected = text
        for pattern, replacement in corrections.items():
            corrected = re.sub(pattern, replacement, corrected, flags=re.IGNORECASE)
            
        return corrected

    def _filter_audio(self, audio_data: np.ndarray, fs: int = 16000) -> np.ndarray:
        """
        Applies a human speech bandpass filter and a spectral subtraction
        gating algorithm to clean background music and steady-state ambient noise,
        while normalizing and preserving quiet whispers.
        """
        if len(audio_data) < 512:
            return audio_data

        try:
            from scipy.signal import butter, lfilter, stft, istft
            
            # Normalize audio first to boost quiet whispers to an audible range
            max_amp = np.max(np.abs(audio_data))
            if max_amp > 0 and max_amp < 0.5:
                # Boost quiet audio safely without hard clipping
                audio_data = audio_data * (0.5 / max_amp)

            # 1. Butterworth Bandpass Filter (human speech harmonics + whispers)
            # Widen the band to 80Hz - 7500Hz. Whispers heavily rely on high-frequency
            # sibilants (up to 8kHz) which were previously being cut off at 3400Hz.
            nyq = 0.5 * fs
            low = 80.0 / nyq
            high = 7500.0 / nyq
            b, a = butter(5, [low, high], btype='band')
            filtered = lfilter(b, a, audio_data)
            
            # 2. Spectral Subtraction (Music & Background Noise removal)
            frequencies, times, Zxx = stft(filtered, fs, nperseg=512, noverlap=384)
            magnitude = np.abs(Zxx)
            phase = np.angle(Zxx)
            
            # Estimate background noise profile from the lowest energy frames
            frame_energies = np.sum(magnitude ** 2, axis=0)
            num_noise_frames = max(1, len(frame_energies) // 10)
            noise_frame_indices = np.argsort(frame_energies)[:num_noise_frames]
            noise_spectrum = np.mean(magnitude[:, noise_frame_indices], axis=1, keepdims=True)
            
            # Subtract noise profile using a softer over-subtraction factor
            # This ensures we don't accidentally subtract out the quiet whisper signal
            alpha = 1.2
            beta = 0.05  # Spectral floor
            
            subtracted_magnitude = magnitude - alpha * noise_spectrum
            subtracted_magnitude = np.maximum(subtracted_magnitude, beta * magnitude)
            
            # Reconstruct and inverse transform
            Zxx_clean = subtracted_magnitude * np.exp(1j * phase)
            _, clean_audio = istft(Zxx_clean, fs, nperseg=512, noverlap=384)
            
            # Keep length aligned to input
            if len(clean_audio) > len(audio_data):
                clean_audio = clean_audio[:len(audio_data)]
            elif len(clean_audio) < len(audio_data):
                clean_audio = np.pad(clean_audio, (0, len(audio_data) - len(clean_audio)))
                
            return clean_audio.astype(np.float32)
        except Exception as e:
            logger.warning(f"Audio pre-filtering failed, falling back to raw audio: {e}")
            return audio_data

    def transcribe(self, audio_data: np.ndarray, sample_rate: int = 16000) -> str:
        """
        Transcribes the input audio data (numpy array).
        Expects single-channel (mono) float32 audio at the specified sample rate (ideally 16000 Hz).
        """
        if self._model is None:
            self.load_model()

        # Ensure the model is loaded (for type checkers)
        assert self._model is not None

        # Pre-filter background music and noise to isolate voice
        audio_data = self._filter_audio(audio_data, sample_rate)

        logger.info(f"Starting transcription of {len(audio_data) / sample_rate:.2f}s of audio...")

        try:
            # transcribe expects a 1D float32 numpy array or filename
            # We pass technical terms as initial_prompt to guide spelling and capitalization
            prompt_guide = "WoiceFlow, Next.js, TypeScript, React, Vite, Python, Wayland, Fedora, GNOME, ydotool, Tailwind CSS, VS Code, GitHub."
            segments, info = self._model.transcribe(
                audio_data,
                beam_size=5,
                language="en",  # Default to English for better latency, or auto-detect if None
                vad_filter=True,  # Use Voice Activity Detection to filter out silence/noise
                vad_parameters=dict(
                    threshold=0.1,  # Ultra-low threshold to detect whispers
                    min_silence_duration_ms=500,
                    speech_pad_ms=400
                ),
                condition_on_previous_text=False, # Prevents hallucinating lyrics from background music
                initial_prompt=prompt_guide
            )

            # Join segments
            text_segments = []
            for segment in segments:
                text_segments.append(segment.text)
                logger.debug(f"Transcribed segment: [{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text!r}")

            full_text = "".join(text_segments).strip()
            full_text = self._correct_typos(full_text)
            logger.info(f"Transcription finished. Result: {full_text!r}")
            return full_text
        except Exception as e:
            logger.exception(f"Error during transcription: {e}")
            return ""
