import os
import subprocess
import shutil
from loguru import logger


def _default_ydotool_socket() -> str:
    """Returns the ydotoold socket path, respecting XDG_RUNTIME_DIR for the current user."""
    uid = str(os.getuid()) if hasattr(os, 'getuid') else "1000"
    runtime_dir = os.environ.get("XDG_RUNTIME_DIR", f"/run/user/{uid}")
    return os.path.join(runtime_dir, ".ydotool_socket")


class TextInjector:
    """Injects text into the active application using ydotool (Linux) or pynput (fallback)."""

    def __init__(self, socket_path: str | None = None):
        self.socket_path = socket_path or _default_ydotool_socket()
        self._ydotool_path = shutil.which("ydotool")

        if not self._ydotool_path:
            logger.info("ydotool not found in PATH. Using cross-platform pynput.keyboard.Controller fallback.")
            from pynput.keyboard import Controller
            self._keyboard = Controller()
            return

        # Ensure the ydotoold daemon is running
        self._ensure_ydotoold_running()

    def _ensure_ydotoold_running(self) -> bool:
        """Checks if ydotoold is running and starts it if necessary, cleaning up stale sockets."""
        
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
        if not text:
            logger.debug("Empty text provided for injection. Skipping.")
            return True

        if not self._ydotool_path:
            try:
                logger.info(f"Injecting text using pynput fallback: {text!r}")
                self._keyboard.type(text)
                return True
            except Exception as e:
                logger.error(f"Failed to inject text via pynput fallback: {e}")
                return False

        import os
        key_delay = os.getenv("WOICEFLOW_KEY_DELAY", "2")
        key_hold = os.getenv("WOICEFLOW_KEY_HOLD", "1")
        logger.info(f"Injecting transcribed text: {text!r} (delay: {key_delay}ms, hold: {key_hold}ms)")

        # Construct the command with optimized latency parameters
        cmd = [self._ydotool_path, "type", "-d", key_delay, "-H", key_hold, "-f", "-"]
        
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
