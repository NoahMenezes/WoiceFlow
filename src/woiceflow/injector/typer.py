import subprocess
import shutil
from loguru import logger

class TextInjector:
    """Injects text into the active application using ydotool."""

    def __init__(self, socket_path: str = "/run/user/1000/.ydotool_socket"):
        self.socket_path = socket_path
        self._ydotool_path = shutil.which("ydotool")

        if not self._ydotool_path:
            logger.warning("ydotool executable not found in PATH. Text injection will fail.")
            return

        # Ensure the ydotoold daemon is running
        self._ensure_ydotoold_running()

    def _ensure_ydotoold_running(self) -> bool:
        """Checks if ydotoold is running and starts it if necessary, cleaning up stale sockets."""
        import os
        
        # 1. Check if ydotoold is already running
        try:
            result = subprocess.run(["pgrep", "-x", "ydotoold"], capture_output=True)
            if result.returncode == 0:
                logger.info("ydotoold daemon is already running.")
                return True
        except Exception:
            pass

        logger.info("ydotoold daemon is not running. Attempting to start it automatically...")

        # 2. Remove stale socket if it exists to prevent bind errors
        if self.socket_path and os.path.exists(self.socket_path):
            try:
                os.unlink(self.socket_path)
                logger.debug(f"Removed stale ydotoold socket: {self.socket_path}")
            except Exception as e:
                logger.warning(f"Could not remove stale socket {self.socket_path}: {e}")

        # 3. Start ydotoold in the background
        ydotoold_path = shutil.which("ydotoold")
        if not ydotoold_path:
            logger.error("ydotoold executable not found in PATH. Cannot start daemon.")
            return False

        try:
            # We start the daemon detached from the parent process group so it lives on
            subprocess.Popen(
                [ydotoold_path, f"--socket-path={self.socket_path}"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                preexec_fn=os.setpgrp
            )
            # Give it a moment to initialize the socket file
            import time
            time.sleep(0.5)
            logger.success("ydotoold daemon started successfully in the background.")
            return True
        except Exception as e:
            logger.error(f"Failed to start ydotoold daemon automatically: {e}")
            return False

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
