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
            base_color = QColor(255, 75, 75)
            glow_alpha = int(80 * (1.0 - self.pulse_val))
            dot_alpha = int(180 + 75 * self.pulse_val)
        elif self.state == "transcribing":
            base_color = QColor(75, 200, 255)
            glow_alpha = int(80 * (1.0 - self.pulse_val))
            dot_alpha = int(180 + 75 * self.pulse_val)
        else:
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


WaveformWidgetParent = QWidget if PYQT_AVAILABLE else object

class WaveformWidget(WaveformWidgetParent):
    """Draws a real-time audio waveform using PyQt6."""
    def __init__(self):
        super().__init__()
        self.setMinimumWidth(150)
        self.setFixedHeight(40)
        self.amplitudes = [0.05] * 25
        self.max_bars = 25

    def add_amplitude(self, amp: float) -> None:
        # Boost silent noise slightly for aesthetics
        if amp < 0.05:
            amp = 0.05 + amp * 1.5
        self.amplitudes.append(amp)
        if len(self.amplitudes) > self.max_bars:
            self.amplitudes.pop(0)
        self.update()

    def clear_waveform(self):
        self.amplitudes = [0.05] * self.max_bars
        self.update()

    def paintEvent(self, event) -> None:
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)
        
        w = self.width()
        h = self.height()
        centerY = h / 2.0
        
        bar_count = len(self.amplitudes)
        spacing = 3
        bar_width = max(2.0, (w - (spacing * (bar_count - 1))) / bar_count)
        
        for i, amp in enumerate(self.amplitudes):
            # Clamp height to fit widget
            bar_h = max(3.0, min(amp * h * 1.2, h - 2.0))
            x = i * (bar_width + spacing)
            y = centerY - (bar_h / 2.0)
            
            # Interpolate color (from green to cyan-teal)
            ratio = i / float(bar_count)
            r = int(46 + (26 - 46) * ratio)
            g = int(204 + (188 - 204) * ratio)
            b = int(113 + (156 - 113) * ratio)
            
            painter.setBrush(QBrush(QColor(r, g, b)))
            painter.setPen(Qt.PenStyle.NoPen)
            painter.drawRoundedRect(int(x), int(y), int(bar_width), int(bar_h), bar_width/2.0, bar_width/2.0)


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
        layout.setSpacing(15)
        
        # Pulse Indicator
        self.indicator = PulsingIndicator()
        layout.addWidget(self.indicator)
        
        # Waveform Widget
        self.waveform = WaveformWidget()
        layout.addWidget(self.waveform)
        
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
        
        if state == "recording":
            self.waveform.clear_waveform()
            
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

    def add_amplitude(self, amp: float) -> None:
        self.waveform.add_amplitude(amp)

    def center_bottom(self) -> None:
        """Positions the HUD at the center-bottom of the primary screen, 200px offset from the bottom."""
        screen = QApplication.primaryScreen().geometry()
        width = self.frameGeometry().width()
        height = self.frameGeometry().height()
        
        x = int((screen.width() - width) / 2)
        y = int(screen.height() - height - 200) # 200px offset from bottom
        self.move(x, y)


class HUDController(QObject):
    """Thread-safe controller that emits signals to update the HUD from background threads."""
    sig_update = pyqtSignal(str, str, int)
    sig_hide = pyqtSignal()
    sig_amplitude = pyqtSignal(float)

    def __init__(self, hud: DictationHUD):
        super().__init__()
        self.hud = hud
        self.sig_update.connect(self.hud.show_state)
        self.sig_hide.connect(self.hud.hide)
        self.sig_amplitude.connect(self.hud.add_amplitude)

    def update_hud(self, state: str, text: str, auto_hide_ms: int = 0) -> None:
        self.sig_update.emit(state, text, auto_hide_ms)

    def hide_hud(self) -> None:
        self.sig_hide.emit()

    def update_amplitude(self, amplitude: float) -> None:
        self.sig_amplitude.emit(amplitude)
