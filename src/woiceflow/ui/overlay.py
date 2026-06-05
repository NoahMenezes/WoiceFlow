import os
import sys
from loguru import logger

try:
    from PyQt6.QtWidgets import QWidget, QLabel, QVBoxLayout, QHBoxLayout, QApplication
    from PyQt6.QtCore import Qt, QTimer, pyqtSignal, QObject, QPointF, QRect
    from PyQt6.QtGui import QPainter, QColor, QBrush, QFont, QPainterPath, QImage, QConicalGradient, QRadialGradient, QPen
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


SiriOrbWidgetParent = QWidget if PYQT_AVAILABLE else object

class SiriOrbWidget(SiriOrbWidgetParent):
    """A highly polished, fluid Siri Orb visualizer written natively in PyQt6."""
    
    def __init__(self, parent=None, size=140):
        super().__init__(parent)
        self.setFixedSize(size, size)
        self.angle = 0.0
        self.amplitude = 0.0
        self.state = "recording" # "recording", "transcribing", "success", "error"

        # Gorgeous dynamic palettes matching modern Siri aesthetics
        self.palettes = {
            "recording": {
                "bg": QColor(10, 10, 15, 255),
                "c1": QColor(255, 0, 128, 255),   # Super Hot Pink/Magenta
                "c2": QColor(0, 210, 255, 255),   # Bright Electric Cyan
                "c3": QColor(140, 30, 255, 255),  # Electric Violet/Purple
            },
            "transcribing": {
                "bg": QColor(10, 10, 15, 255),
                "c1": QColor(130, 0, 255, 255),   # Vivid Purple
                "c2": QColor(0, 255, 160, 255),   # Bright Turquoise/Mint
                "c3": QColor(0, 80, 255, 255),    # Vibrant Neon Blue
            },
            "success": {
                "bg": QColor(10, 15, 10, 255),
                "c1": QColor(39, 230, 120, 255),  # Hyper Emerald Green
                "c2": QColor(130, 255, 170, 255), # Bright Neon Green
                "c3": QColor(0, 230, 180, 255),   # Radiant Cyan/Teal
            },
            "error": {
                "bg": QColor(15, 10, 10, 255),
                "c1": QColor(255, 20, 20, 255),   # Pure Bright Red
                "c2": QColor(255, 140, 0, 255),   # Radiant Orange
                "c3": QColor(210, 0, 0, 255),     # Strong Dark Red
            }
        }
        
        # Load default recording palette colors
        self.bg_color = self.palettes["recording"]["bg"]
        self.c1 = self.palettes["recording"]["c1"]
        self.c2 = self.palettes["recording"]["c2"]
        self.c3 = self.palettes["recording"]["c3"]
        
        # Physics-based tick loop for smooth 60fps animations
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_animation)
        self.timer.start(16) # ~62.5 FPS

    def set_state(self, state: str) -> None:
        if state not in self.palettes:
            state = "recording"
        self.state = state
        
        # Set new target palette colors
        palette = self.palettes[state]
        self.bg_color = palette["bg"]
        self.c1 = palette["c1"]
        self.c2 = palette["c2"]
        self.c3 = palette["c3"]
        self.update()

    def set_amplitude(self, amp: float) -> None:
        # Smoothly interpolate amplitude (lerp) to avoid visual jitter
        self.amplitude = self.amplitude * 0.65 + amp * 0.35
        self.update()

    def update_animation(self) -> None:
        # Spin velocity depends on state and microphone amplitude
        base_speed = 1.2
        if self.state == "transcribing":
            base_speed = 3.5
        elif self.state == "success":
            base_speed = 0.6
        elif self.state == "error":
            base_speed = 0.3

        # Multiply speed when active speech is detected
        speed_multiplier = 1.0 + self.amplitude * 4.5
        self.angle += base_speed * speed_multiplier
        if self.angle >= 360.0:
            self.angle -= 360.0
        self.update()

    def paintEvent(self, event) -> None:
        if not PYQT_AVAILABLE:
            return
            
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)
        
        w = self.width()
        h = self.height()
        
        # 1. Circle Clip
        clip_path = QPainterPath()
        clip_path.addEllipse(0, 0, w, h)
        painter.setClipPath(clip_path)
        
        # 2. Draw base sphere background
        painter.setBrush(QBrush(QColor(8, 8, 12, 235)))
        painter.setPen(Qt.PenStyle.NoPen)
        painter.drawEllipse(0, 0, w, h)
        
        # 3. Render gradients onto a downscaled image for high-performance bilinear blur simulation
        scale_factor = 6
        sw = max(8, w // scale_factor)
        sh = max(8, h // scale_factor)
        
        grad_img = QImage(sw, sh, QImage.Format.Format_ARGB32_Premultiplied)
        grad_img.fill(Qt.GlobalColor.transparent)
        
        grad_painter = QPainter(grad_img)
        grad_painter.setRenderHint(QPainter.RenderHint.Antialiasing)
        
        # Adjust center points for gradients
        # Base scale on amplitude to create expanding visual wave effect
        amp_scale = 1.0 + self.amplitude * 0.15
        
        # 6: conic-gradient(from calc(var(--angle) * -2) at 85% 10%, var(--c3), transparent 20% 80%, var(--c3))
        g6 = QConicalGradient(QPointF(0.85 * sw, 0.10 * sh), -self.angle * 2.0)
        g6.setColorAt(0.0, self.c3)
        g6.setColorAt(0.2, QColor(0, 0, 0, 0))
        g6.setColorAt(0.8, QColor(0, 0, 0, 0))
        g6.setColorAt(1.0, self.c3)
        grad_painter.setBrush(g6)
        grad_painter.drawRect(0, 0, sw, sh)
        
        # 5: conic-gradient(from calc(var(--angle) * 1) at 20% 80%, var(--c1), transparent 10% 90%, var(--c1))
        g5 = QConicalGradient(QPointF(0.20 * sw, 0.80 * sh), self.angle * 1.0)
        g5.setColorAt(0.0, self.c1)
        g5.setColorAt(0.1, QColor(0, 0, 0, 0))
        g5.setColorAt(0.9, QColor(0, 0, 0, 0))
        g5.setColorAt(1.0, self.c1)
        grad_painter.setBrush(g5)
        grad_painter.drawRect(0, 0, sw, sh)
        
        # 4: conic-gradient(from calc(var(--angle) * 2) at 15% 5%, var(--c2), transparent 10% 90%, var(--c2))
        g4 = QConicalGradient(QPointF(0.15 * sw, 0.05 * sh), self.angle * 2.0)
        g4.setColorAt(0.0, self.c2)
        g4.setColorAt(0.1, QColor(0, 0, 0, 0))
        g4.setColorAt(0.9, QColor(0, 0, 0, 0))
        g4.setColorAt(1.0, self.c2)
        grad_painter.setBrush(g4)
        grad_painter.drawRect(0, 0, sw, sh)
        
        # 3: conic-gradient(from calc(var(--angle) * -3) at 80% 20%, var(--c1), transparent 40% 60%, var(--c1))
        g3 = QConicalGradient(QPointF(0.80 * sw, 0.20 * sh), -self.angle * 3.0)
        g3.setColorAt(0.0, self.c1)
        g3.setColorAt(0.4, QColor(0, 0, 0, 0))
        g3.setColorAt(0.6, QColor(0, 0, 0, 0))
        g3.setColorAt(1.0, self.c1)
        grad_painter.setBrush(g3)
        grad_painter.drawRect(0, 0, sw, sh)
        
        # 2: conic-gradient(from calc(var(--angle) * 2) at 45% 75%, var(--c2), transparent 30% 60%, var(--c2))
        g2 = QConicalGradient(QPointF(0.45 * sw, 0.75 * sh), self.angle * 2.0)
        g2.setColorAt(0.0, self.c2)
        g2.setColorAt(0.3, QColor(0, 0, 0, 0))
        g2.setColorAt(0.6, QColor(0, 0, 0, 0))
        g2.setColorAt(1.0, self.c2)
        grad_painter.setBrush(g2)
        grad_painter.drawRect(0, 0, sw, sh)
        
        # 1: conic-gradient(from calc(var(--angle) * 2) at 25% 70%, var(--c3), transparent 20% 80%, var(--c3))
        g1 = QConicalGradient(QPointF(0.25 * sw, 0.70 * sh), self.angle * 2.0)
        g1.setColorAt(0.0, self.c3)
        g1.setColorAt(0.2, QColor(0, 0, 0, 0))
        g1.setColorAt(0.8, QColor(0, 0, 0, 0))
        g1.setColorAt(1.0, self.c3)
        grad_painter.setBrush(g1)
        grad_painter.drawRect(0, 0, sw, sh)
        
        grad_painter.end()
        
        # 4. Upscale blurred image to full canvas with bilinear filtering
        # Render it twice to double color density and brightness (simulating CSS contrast/saturation boost)
        painter.save()
        painter.setRenderHint(QPainter.RenderHint.SmoothPixmapTransform)
        glow_margin = int(self.amplitude * 18.0)
        painter.drawImage(QRect(-glow_margin, -glow_margin, w + glow_margin * 2, h + glow_margin * 2), grad_img)
        painter.drawImage(QRect(-glow_margin, -glow_margin, w + glow_margin * 2, h + glow_margin * 2), grad_img)
        painter.restore()
        
        # 5. Draw overlay dot pattern grid
        painter.save()
        painter.setCompositionMode(QPainter.CompositionMode.CompositionMode_Overlay)
        dot_size = max(1.0, w * 0.007)
        spacing = max(4.0, dot_size * 4.0)
        
        painter.setBrush(QBrush(QColor(255, 255, 255, 170)))
        painter.setPen(Qt.PenStyle.NoPen)
        
        x = spacing / 2.0
        while x < w:
            y = spacing / 2.0
            while y < h:
                painter.drawEllipse(QPointF(x, y), dot_size, dot_size)
                y += spacing
            x += spacing
        painter.restore()
        
        # 6. Apply radial mask to create spherical vignette
        mask_gradient = QRadialGradient(QPointF(w/2.0, h/2.0), w/2.0)
        mask_gradient.setColorAt(0.0, QColor(0, 0, 0, 255))
        mask_gradient.setColorAt(0.40 + 0.15 * self.amplitude, QColor(0, 0, 0, 255)) # Opaque center scales wider
        mask_gradient.setColorAt(0.80, QColor(0, 0, 0, 140)) # More opaque outer mid-ring
        mask_gradient.setColorAt(0.95, QColor(0, 0, 0, 0))
        mask_gradient.setColorAt(1.0, QColor(0, 0, 0, 0))
        
        painter.save()
        painter.setCompositionMode(QPainter.CompositionMode.CompositionMode_DestinationIn)
        painter.setBrush(mask_gradient)
        painter.drawEllipse(0, 0, w, h)
        painter.restore()

        # 7. Draw subtle glass border reflection
        painter.save()
        painter.setBrush(Qt.BrushStyle.NoBrush)
        painter.setPen(QPen(QColor(255, 255, 255, 30), 1.0))
        painter.drawEllipse(0, 0, w - 1, h - 1)
        painter.restore()


DictationHUDParent = QWidget if PYQT_AVAILABLE else object

class DictationHUD(DictationHUDParent):
    """Borderless, glassmorphic HUD that floats on top of all windows at the bottom of the screen."""

    def __init__(self):
        super().__init__()
        if not PYQT_AVAILABLE:
            return
            
        flags = (
            Qt.WindowType.FramelessWindowHint |
            Qt.WindowType.WindowStaysOnTopHint |
            Qt.WindowType.Tool |
            Qt.WindowType.WindowDoesNotAcceptFocus
        )
        if sys.platform.startswith("linux"):
            flags |= Qt.WindowType.BypassWindowManagerHint
        self.setWindowFlags(flags)
        self.setAttribute(Qt.WidgetAttribute.WA_TranslucentBackground)
        self.setAttribute(Qt.WidgetAttribute.WA_ShowWithoutActivating)
        self.setAttribute(Qt.WidgetAttribute.WA_TransparentForMouseEvents)
        
        # Vertical Layout Setup
        layout = QVBoxLayout(self)
        layout.setContentsMargins(10, 10, 10, 10)
        layout.setSpacing(0)
        layout.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        # Siri Orb Widget
        self.orb = SiriOrbWidget(size=140)
        layout.addWidget(self.orb, alignment=Qt.AlignmentFlag.AlignCenter)
        
        # Transparent background for the top-level HUD window itself
        self.setStyleSheet("background-color: transparent; border: none;")

        self.hide_timer = QTimer(self)
        self.hide_timer.setSingleShot(True)
        self.hide_timer.timeout.connect(self.hide)

    def show_state(self, state: str, text: str, auto_hide_ms: int = 0) -> None:
        """Updates the HUD state, size, positions it, and shows it."""
        if not PYQT_AVAILABLE:
            return
            
        self.orb.set_state(state)
        
        # Adjust layout size dynamically based on elements
        self.adjustSize()
        self.center_bottom()
        
        self.show()
        
        # Auto-hide if requested
        if auto_hide_ms > 0:
            self.hide_timer.start(auto_hide_ms)
        else:
            self.hide_timer.stop()

    def add_amplitude(self, amp: float) -> None:
        if not PYQT_AVAILABLE:
            return
        self.orb.set_amplitude(amp)

    def center_bottom(self) -> None:
        """Positions the HUD at the bottom-right of the primary screen, offset by 40px from the edges."""
        screen = QApplication.primaryScreen().geometry()
        width = self.frameGeometry().width()
        height = self.frameGeometry().height()
        
        # Position at the bottom-right of the screen
        x = int(screen.width() - width - 40)
        y = int(screen.height() - height - 80)
        self.move(x, y)


class HUDController(QObject):
    """Thread-safe controller that emits signals to update the HUD from background threads."""
    sig_update = pyqtSignal(str, str, int)
    sig_hide = pyqtSignal()
    sig_amplitude = pyqtSignal(float)

    def __init__(self, hud: DictationHUD):
        super().__init__()
        self.hud = hud
        if PYQT_AVAILABLE:
            self.sig_update.connect(self.hud.show_state)
            self.sig_hide.connect(self.hud.hide)
            self.sig_amplitude.connect(self.hud.add_amplitude)

    def update_hud(self, state: str, text: str, auto_hide_ms: int = 0) -> None:
        self.sig_update.emit(state, text, auto_hide_ms)

    def hide_hud(self) -> None:
        self.sig_hide.emit()

    def update_amplitude(self, amplitude: float) -> None:
        self.sig_amplitude.emit(amplitude)
