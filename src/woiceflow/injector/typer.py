import os
import sys
import subprocess
import shutil
import time
from loguru import logger
from pynput.keyboard import Controller


def _default_ydotool_socket() -> str:
    """Returns the ydotoold socket path, respecting XDG_RUNTIME_DIR for the current user."""
    if sys.platform.startswith("win32"):
        return ""
    try:
        uid = os.getuid()
    except AttributeError:
        uid = 0
    runtime_dir = os.environ.get("XDG_RUNTIME_DIR", f"/run/user/{uid}")
    return os.path.join(runtime_dir, ".ydotool_socket")


class TextInjector:
    """Injects text into the active application using platform-specific methods."""

    def __init__(self, socket_path: str | None = None):
        self.platform = sys.platform
        self._keyboard = Controller()

        if self.platform.startswith("linux"):
            self.socket_path = socket_path or _default_ydotool_socket()
            self._ydotool_path = shutil.which("ydotool")

            if not self._ydotool_path:
                logger.warning("ydotool executable not found in PATH. Text injection will fall back to pynput.")
            else:
                # Ensure the ydotoold daemon is running
                self._ensure_ydotoold_running()
        else:
            self.socket_path = None
            self._ydotool_path = None
            logger.info(f"Initialized pynput injector for platform: {self.platform}")

    def _ensure_ydotoold_running(self) -> bool:
        """Checks if ydotoold is running and starts it if necessary, cleaning up stale sockets."""
        if not self.platform.startswith("linux"):
            return False

        # 1. Check if ydotoold is already running (pgrep is POSIX-standard, but guard anyway)
        try:
            result = subprocess.run(
                ["pgrep", "-x", "ydotoold"],
                capture_output=True
            )
            if result.returncode == 0:
                logger.info("ydotoold daemon is already running.")
                return True
        except FileNotFoundError:
            # pgrep not available on this distro — check via ps instead
            try:
                result = subprocess.run(
                    ["ps", "-eo", "comm"],
                    capture_output=True, text=True
                )
                if "ydotoold" in result.stdout:
                    logger.info("ydotoold daemon is already running (detected via ps).")
                    return True
            except Exception:
                pass
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
            # Detach daemon from our process group so it survives WoiceFlow restarts
            kwargs = {}
            if os.name == "posix":
                kwargs["preexec_fn"] = os.setpgrp
            elif os.name == "nt":
                kwargs["creationflags"] = subprocess.CREATE_NEW_PROCESS_GROUP

            subprocess.Popen(
                [ydotoold_path, f"--socket-path={self.socket_path}"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                **kwargs
            )
            # Give it a moment to initialize the socket file
            time.sleep(0.5)
            logger.success("ydotoold daemon started successfully in the background.")
            return True
        except Exception as e:
            logger.error(f"Failed to start ydotoold daemon automatically: {e}")
            return False

    def inject(self, text: str) -> bool:
        """
        Injects the given text into the active window.
        Uses ydotool on Linux (with fallback to pynput) and pynput on other platforms.
        Returns True if successful, False otherwise.
        """
        if not text:
            logger.debug("Empty text provided for injection. Skipping.")
            return True

        # If on Linux and ydotool is available, use it
        if self.platform.startswith("linux") and self._ydotool_path:
            key_delay = os.getenv("WOICEFLOW_KEY_DELAY", "2")
            key_hold = os.getenv("WOICEFLOW_KEY_HOLD", "1")
            logger.info(f"Injecting text using ydotool: {text!r} (delay: {key_delay}ms, hold: {key_hold}ms)")

            cmd = [self._ydotool_path, "type", "-d", key_delay, "-H", key_hold, "-f", "-"]
            env = os.environ.copy()
            if self.socket_path:
                env["YDOTOOL_SOCKET"] = self.socket_path

            try:
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
                    logger.warning("Falling back to pynput for text injection.")
            except Exception as e:
                logger.exception(f"Failed to execute ydotool text injection: {e}")
                logger.warning("Falling back to pynput for text injection.")

        # Fallback / Default injection using pynput
        logger.info(f"Injecting text using pynput keyboard controller: {text!r}")
        try:
            self._keyboard.type(text)
            logger.success("Text successfully injected using pynput.")
            return True
        except Exception as e:
            logger.error(f"Failed to inject text using pynput: {e}")
            return False
