import subprocess
import shutil
from loguru import logger

class TextInjector:
    """Injects text into the active application using ydotool."""

    def __init__(self, socket_path: str | None = None):
        self.socket_path = socket_path
        self._ydotool_path = shutil.which("ydotool")

        if not self._ydotool_path:
            logger.warning("ydotool executable not found in PATH. Text injection will fail.")

    def inject(self, text: str) -> bool:
        """
        Injects the given text into the active window by piping it to ydotool.
        Returns True if successful, False otherwise.
        """
        if not self._ydotool_path:
            logger.error("Cannot inject text: ydotool is not installed or not in PATH.")
            return False

        if not text:
            logger.debug("Empty text provided for injection. Skipping.")
            return True

        logger.info(f"Injecting transcribed text: {text!r}")

        # Construct the command
        cmd = [self._ydotool_path, "type", "-f", "-"]
        
        # Prepare environment
        import os
        env = os.environ.copy()
        if self.socket_path:
            env["YDOTOOL_SOCKET"] = self.socket_path

        try:
            # We use Popen and stdin.write to write the text directly to stdin
            process = subprocess.Popen(
                cmd,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                env=env
            )
            stdout, stderr = process.communicate(input=text)
            
            if process.returncode == 0:
                logger.success("Text successfully injected using ydotool.")
                return True
            else:
                logger.error(f"ydotool failed with return code {process.returncode}: {stderr.strip()}")
                return False
        except Exception as e:
            logger.exception(f"Failed to execute ydotool text injection: {e}")
            return False
