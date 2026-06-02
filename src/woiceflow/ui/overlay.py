import os
from loguru import logger

try:
    from PyQt6.QtWidgets import QWidget, QLabel, QHBoxLayout, QApplication
    from PyQt6.QtCore import Qt, QTimer, pyqtSignal, QObject
    from PyQt6.QtGui import QPainter, QColor, QBrush, QFont
    PYQT_AVAILABLE = True
except ImportError:
    PYQT_AVAILABLE = False
    logger.warning("PyQt6 is not available. GUI overlay will not be functional.")

PulsingIndicatorParent = QWidget if PYQT_AVAILABLE else object

class PulsingIndicator(PulsingIndicatorParent):
    """A beautiful canvas widget that draws state-dependent pulsing visual indicators."""
    
    def __init__(self):
        super().__init__()
        self.setFixedSize(24, 24)
        self.pulse_val = 0.0
        self.pulse_dir = 1
        self.state = "recording" # "recording", "transcribing", "success"
        
        # Pulse timer
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_pulse)
        self.timer.start(30) # ~33 FPS

    def set_state(self, state: str) -> None:
        self.state = state
        self.update()

    def update_pulse(self) -> None:
        self.pulse_val += 0.05 * self.pulse_dir
        if self.pulse_val >= 1.0:
            self.pulse_val = 1.0
            self.pulse_dir = -1
        elif self.pulse_val <= 0.0:
            self.pulse_val = 0.0
            self.pulse_dir = 1
        self.update()

    def paintEvent(self, event) -> None:
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)
        
        # Select colors based on current state
        if self.state == "recording":
            # Pulsing Red
            base_color = QColor(255, 75, 75)
            glow_alpha = int(80 * (1.0 - self.pulse_val))
            dot_alpha = int(180 + 75 * self.pulse_val)
        elif self.state == "transcribing":
            # Pulsing Cyan
            base_color = QColor(75, 200, 255)
            glow_alpha = int(80 * (1.0 - self.pulse_val))
            dot_alpha = int(180 + 75 * self.pulse_val)
        else:
            # Solid Green (Success)
            base_color = QColor(75, 255, 120)
            glow_alpha = 0
            dot_alpha = 255

        # Draw outer glowing ring
        if glow_alpha > 0:
            glow_radius = int(6 + 6 * self.pulse_val)
            glow_color = QColor(base_color.red(), base_color.green(), base_color.blue(), glow_alpha)
            painter.setBrush(QBrush(glow_color))
            painter.setPen(Qt.PenStyle.NoPen)
            painter.drawEllipse(12 - glow_radius, 12 - glow_radius, glow_radius * 2, glow_radius * 2)

        # Draw inner solid dot
        inner_color = QColor(base_color.red(), base_color.green(), base_color.blue(), dot_alpha)
        painter.setBrush(QBrush(inner_color))
        painter.setPen(Qt.PenStyle.NoPen)
        painter.drawEllipse(7, 7, 10, 10)


DictationHUDParent = QWidget if PYQT_AVAILABLE else object

class DictationHUD(DictationHUDParent):
    """Borderless, glassmorphic HUD that floats on top of all windows at the bottom of the screen."""

    def __init__(self):
        super().__init__()
        self.setWindowFlags(
            Qt.WindowType.FramelessWindowHint |
            Qt.WindowType.WindowStaysOnTopHint |
            Qt.WindowType.Tool |
            Qt.WindowType.BypassWindowManagerHint
        )
        self.setAttribute(Qt.WidgetAttribute.WA_TranslucentBackground)
        
        # Layout Setup
        layout = QHBoxLayout(self)
        layout.setContentsMargins(20, 10, 20, 10)
        layout.setSpacing(12)
        
        # Pulse Indicator
        self.indicator = PulsingIndicator()
        layout.addWidget(self.indicator)
        
        # Message Label
        self.label = QLabel("Initializing...")
        self.label.setStyleSheet(
            "color: #FFFFFF; "
            "font-size: 14px; "
            "font-weight: 500; "
            "font-family: 'Inter', 'Segoe UI', -apple-system, sans-serif;"
            "background-color: transparent;"
        )
        layout.addWidget(self.label)
        
        # Set central glassmorphism style
        self.setStyleSheet("""
            background-color: rgba(20, 20, 20, 220);
            border: 1px solid rgba(255, 255, 255, 45);
            border-radius: 18px;
        """)

        self.hide_timer = QTimer(self)
        self.hide_timer.setSingleShot(True)
        self.hide_timer.timeout.connect(self.hide)

    def show_state(self, state: str, text: str, auto_hide_ms: int = 0) -> None:
        """Updates the HUD state, label, size, positions it, and shows it."""
        self.label.setText(text)
        self.indicator.set_state(state)
        
        # Adjust layout size dynamically based on text
        self.label.adjustSize()
        self.adjustSize()
        self.center_bottom()
        
        self.show()
        
        # Auto-hide if requested
        if auto_hide_ms > 0:
            self.hide_timer.start(auto_hide_ms)
        else:
            self.hide_timer.stop()

    def center_bottom(self) -> None:
        """Positions the HUD at the center-bottom of the primary screen."""
        screen = QApplication.primaryScreen().geometry()
        width = self.frameGeometry().width()
        height = self.frameGeometry().height()
        
        x = int((screen.width() - width) / 2)
        y = int(screen.height() - height - 80) # 80px offset from bottom
        self.move(x, y)


class HUDController(QObject):
    """Thread-safe controller that emits signals to update the HUD from background threads."""
    sig_update = pyqtSignal(str, str, int)

    def __init__(self, hud: DictationHUD):
        super().__init__()
        self.hud = hud
        self.sig_update.connect(self.hud.show_state)

    def update_hud(self, state: str, text: str, auto_hide_ms: int = 0) -> None:
        self.sig_update.emit(state, text, auto_hide_ms)
