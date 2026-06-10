import ollama
from loguru import logger
import os

class TextFormatter:
    """Formats raw dictation transcripts into structured, grammatically correct text using a local LLM via Ollama."""

    def __init__(self, model_name: str = "phi3"):
        # We default to 'phi3' because it is extremely fast (2.3GB), excellent at grammar, 
        # and strictly follows formatting rules without cutting down the text length.
        self.model_name = os.getenv("WOICEFLOW_LLM_MODEL", model_name)
        self._ensure_ollama_running()
        
    def _ensure_ollama_running(self):
        """Silently starts the Ollama server in the background if it isn't running."""
        try:
            # Check if the server is already responding
            ollama.list()
        except Exception:
            logger.info("Ollama server is not running. Starting it silently in the background...")
            import subprocess
            # Spawn the server in the background. It takes 0 RAM when idle.
            subprocess.Popen(
                ["ollama", "serve"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                start_new_session=True
            )
            import time
            time.sleep(2) # Give it a moment to boot up
            
            # Ensure the model is downloaded
            try:
                models = [m['name'] for m in ollama.list().get('models', [])]
                if self.model_name not in models and f"{self.model_name}:latest" not in models:
                    logger.info(f"Downloading the '{self.model_name}' model (this only happens once)...")
                    ollama.pull(self.model_name)
            except Exception as e:
                logger.error(f"Failed to check/pull Ollama model: {e}")

    def format(self, raw_text: str) -> str:
        """Sends the raw transcript to Ollama for formatting and returns the cleaned text."""
        if not raw_text or len(raw_text.strip()) < 10:
            # If the text is too short, just return it as-is to save time
            return raw_text

        logger.info(f"Sending text to local Ollama model '{self.model_name}' for formatting...")
        
        system_prompt = (
            "You are an expert text formatting and grammar assistant for a voice dictation tool. "
            "Your ONLY job is to take the user's raw transcribed speech and format it beautifully. "
            "Follow these RULES strictly:\n"
            "1. Fix all grammatical, spelling, and syntax errors perfectly.\n"
            "2. If the user lists items or describes a process, structure them using bullet points or numbered lists.\n"
            "3. DO NOT summarize, shorten, or remove any information. The length and detail must remain the same.\n"
            "4. NEVER add conversational filler like 'Here is your text:', 'Sure!', or 'I have formatted it'. "
            "Output ONLY the final formatted text."
        )

        try:
            response = ollama.chat(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": raw_text}
                ],
                options={"temperature": 0.1} # Low temperature for accurate, non-creative formatting
            )
            
            formatted_text = response['message']['content'].strip()
            logger.success("Text formatting completed successfully.")
            return formatted_text
        except Exception as e:
            logger.error(f"Ollama formatting failed (is the model pulled and server running?): {e}")
            # If Ollama fails, we safely fall back to the raw, unformatted text
            return raw_text
