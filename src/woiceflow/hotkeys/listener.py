import threading
from typing import Callable
from pynput import keyboard
from loguru import logger

class HotkeyListener:
    """
    Listens for a global hotkey (e.g. F9) to trigger actions.
    Uses pynput under the hood. Runs in a separate daemon thread.
    """

    def __init__(self, hotkey_str: str, on_trigger: Callable[[], None]):
        """
        :param hotkey_str: Hotkey definition like '<f9>' or '<ctrl>+<alt>+r'
        :param on_trigger: Callback function to invoke when hotkey is pressed
        """
        self.hotkey_str = hotkey_str.lower()
        self.on_trigger = on_trigger
        self.listener = None
        self._thread = None

    def _on_activate(self) -> None:
        """Called when the global hotkey is pressed."""
        logger.info(f"Hotkey '{self.hotkey_str}' activated.")
        try:
            self.on_trigger()
        except Exception as e:
            logger.exception(f"Error inside hotkey trigger callback: {e}")

    def _run_listener(self) -> None:
        """Target run method for the listener thread."""
        logger.info(f"Starting global hotkey listener for: {self.hotkey_str}")
        try:
            # GlobalHotKeys expects a dictionary mapping hotkey strings to callbacks
            hotkey_mapping = {self.hotkey_str: self._on_activate}
            with keyboard.GlobalHotKeys(hotkey_mapping) as self.listener:
                self.listener.join()
        except Exception as e:
            logger.error(f"Global hotkey listener encountered an error: {e}")
            logger.warning(
                "If running in a headless or pure Wayland environment without X11 compatibility (XWayland) "
                "or appropriate permissions, pynput global listeners may not function."
            )

    def start(self) -> None:
        """Starts the listener in a background thread."""
        if self._thread and self._thread.is_alive():
            logger.warning("Hotkey listener is already running.")
            return

        self._thread = threading.Thread(target=self._run_listener, daemon=True)
        self._thread.start()
        logger.debug("Hotkey listener thread spawned.")

    def stop(self) -> None:
        """Stops the listener and joins the thread."""
        if self.listener:
            logger.info("Stopping hotkey listener...")
            self.listener.stop()
            self.listener = None
        
        if self._thread:
            self._thread.join(timeout=1.0)
            self._thread = None
            logger.debug("Hotkey listener thread stopped.")
