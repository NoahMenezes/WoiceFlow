import ollama
from loguru import logger
import os

class TextFormatter:
    """Formats raw dictation transcripts into structured, grammatically correct text using a local LLM via Ollama."""

    def __init__(self, model_name: str = "llama3.2:latest"):
        # We default to 'llama3.2' because the user already has it installed, and it's excellent for strict formatting.
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
                response = ollama.list()
                # The ollama library might return dicts or objects depending on version
                models = []
                for m in getattr(response, 'models', response.get('models', [])):
                    if isinstance(m, dict):
                        models.append(m.get('name', m.get('model', '')))
                    else:
                        models.append(getattr(m, 'model', getattr(m, 'name', '')))
                        
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
            "2. If the user mentions a list of items or describes a process (e.g. 'I want to list three things...'), "
            "STRUCTURE THEM IMMEDIATELY using numbered bullet points on separate lines (e.g., 1) Morning 2) Evening).\n"
            "3. Add proper spacing and newlines for readability.\n"
            "4. DO NOT summarize, shorten, or remove any information. The length and detail must remain the same.\n"
            "5. NEVER add conversational filler like 'Here is your text:', 'Sure!', or 'I have formatted it'. "
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
