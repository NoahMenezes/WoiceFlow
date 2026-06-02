import sys
from loguru import logger

try:
    from PyQt6.QtWidgets import QApplication, QSystemTrayIcon, QMenu
    from PyQt6.QtGui import QIcon, QAction
    PYQT_AVAILABLE = True
except ImportError:
    PYQT_AVAILABLE = False
    logger.warning("PyQt6 is not available. System tray UI will not be functional.")

class SystemTrayApp:
    """A simple system tray application for WoiceFlow using PyQt6."""

    def __init__(self, on_toggle_callback=None, on_quit_callback=None):
        self.on_toggle_callback = on_toggle_callback
        self.on_quit_callback = on_quit_callback
        self.app = None
        self.tray_icon = None

    def run(self) -> None:
        """Starts the PyQt6 event loop and creates the tray icon."""
        if not PYQT_AVAILABLE:
            logger.error("Cannot run system tray: PyQt6 is missing.")
            return

        logger.info("Initializing PyQt6 System Tray...")
        self.app = QApplication(sys.argv)
        
        # Prevent the application from exiting when the last window is closed
        self.app.setQuitOnLastWindowClosed(False)

        # Create tray icon
        self.tray_icon = QSystemTrayIcon(self.app)
        
        # Set a default system icon for now (e.g. computer/audio/volume)
        # We can use a standard theme icon to avoid needing an external file
        icon = QIcon.fromTheme("audio-input-microphone", QIcon.fromTheme("media-record"))
        self.tray_icon.setIcon(icon)
        self.tray_icon.setToolTip("WoiceFlow - Voice Dictation")

        # Create menu
        menu = QMenu()
        
        # Toggle recording action
        toggle_action = QAction("Toggle Recording (F9)", menu)
        if self.on_toggle_callback:
            toggle_action.triggered.connect(self.on_toggle_callback)
        menu.addAction(toggle_action)
        
        menu.addSeparator()

        # Quit action
        quit_action = QAction("Quit", menu)
        quit_action.triggered.connect(self._handle_quit)
        menu.addAction(quit_action)

        self.tray_icon.setContextMenu(menu)
        self.tray_icon.show()
        
        logger.success("System Tray initialized and running.")
        sys.exit(self.app.exec())

    def _handle_quit(self) -> None:
        """Handles the application quit event."""
        logger.info("Quitting WoiceFlow via tray icon...")
        if self.on_quit_callback:
            self.on_quit_callback()
        if self.tray_icon:
            self.tray_icon.hide()
        if self.app:
            self.app.quit()
        sys.exit(0)
