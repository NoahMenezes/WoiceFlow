#!/bin/bash
# WoiceFlow Linux Installer
# Supports: Fedora, Ubuntu, Debian, Arch, Manjaro, EndeavourOS, openSUSE,
#           Alpine, Gentoo, Pop!_OS, Linux Mint, elementary OS, Zorin OS,
#           Kali Linux, MX Linux, Void Linux, NixOS (nix-env), and more.
# Sets up WoiceFlow to run automatically in the background using systemd user service.

set -e

INSTALL_DIR="$HOME/.local/share/woiceflow"
SYSTEMD_USER_DIR="$HOME/.config/systemd/user"
SERVICE_NAME="woiceflow"

echo "🎙️  Installing WoiceFlow..."
echo ""

# ─────────────────────────────────────────────
# Helper utilities
# ─────────────────────────────────────────────
info()    { echo "  [INFO] $*"; }
success() { echo "  ✅ $*"; }
warn()    { echo "  ⚠️  $*"; }
error()   { echo "  ❌ $*" >&2; }

# ─────────────────────────────────────────────
# 1. Detect Linux distribution & package manager
# ─────────────────────────────────────────────
echo "======================================================"
echo " Step 1: Detecting your Linux distribution..."
echo "======================================================"

PKG_MANAGER=""
DISTRO_ID=""
DISTRO_LIKE=""

if [ -f /etc/os-release ]; then
    . /etc/os-release
    DISTRO_ID="${ID:-unknown}"
    DISTRO_LIKE="${ID_LIKE:-}"
fi

detect_pkg_manager() {
    if   command -v apt-get &>/dev/null; then PKG_MANAGER="apt"
    elif command -v dnf     &>/dev/null; then PKG_MANAGER="dnf"
    elif command -v pacman  &>/dev/null; then PKG_MANAGER="pacman"
    elif command -v zypper  &>/dev/null; then PKG_MANAGER="zypper"
    elif command -v apk     &>/dev/null; then PKG_MANAGER="apk"
    elif command -v xbps-install &>/dev/null; then PKG_MANAGER="xbps"
    elif command -v emerge  &>/dev/null; then PKG_MANAGER="emerge"
    elif command -v nix-env &>/dev/null; then PKG_MANAGER="nix"
    elif command -v yum     &>/dev/null; then PKG_MANAGER="yum"
    else PKG_MANAGER="unknown"
    fi
}
detect_pkg_manager

info "Distro: ${PRETTY_NAME:-$DISTRO_ID}  |  Package manager: $PKG_MANAGER"
echo ""

# ─────────────────────────────────────────────
# 2. Install system-level dependencies
# ─────────────────────────────────────────────
echo "======================================================"
echo " Step 2: Installing system dependencies..."
echo "======================================================"
info "This installs Python 3, pip, venv, PortAudio, Git, and build tools."
echo ""

install_system_deps() {
    case "$PKG_MANAGER" in

        # ── Debian / Ubuntu / Mint / Pop!_OS / Zorin / Kali / MX Linux ──
        apt)
            sudo apt-get update -qq
            sudo apt-get install -y \
                python3 python3-pip python3-venv python3-dev \
                git curl wget \
                portaudio19-dev libportaudio2 \
                libglib2.0-0 libasound2-dev \
                gcc g++ make \
                xdotool || true
            ;;

        # ── Fedora / RHEL / CentOS / Rocky / AlmaLinux ──
        dnf)
            sudo dnf install -y \
                python3 python3-pip python3-devel \
                git curl wget \
                portaudio portaudio-devel \
                glib2 alsa-lib-devel \
                gcc gcc-c++ make \
                xdotool || true
            ;;

        # ── Arch Linux / Manjaro / EndeavourOS / Garuda / ArcoLinux ──
        pacman)
            sudo pacman -Sy --noconfirm \
                python python-pip \
                git curl wget \
                portaudio \
                glib2 alsa-lib \
                gcc make \
                xdotool || true

            # Install ydotool from AUR if yay or paru is available
            if command -v yay &>/dev/null; then
                info "Attempting to install ydotool from AUR via yay..."
                yay -S --noconfirm ydotool || warn "Could not install ydotool via yay. Text injection will use pynput fallback."
            elif command -v paru &>/dev/null; then
                info "Attempting to install ydotool from AUR via paru..."
                paru -S --noconfirm ydotool || warn "Could not install ydotool via paru. Text injection will use pynput fallback."
            else
                warn "No AUR helper found (yay/paru). Skipping ydotool AUR install."
                warn "If text injection doesn't work, install ydotool manually: https://github.com/ReimuNotMoe/ydotool"
            fi
            ;;

        # ── openSUSE (Tumbleweed / Leap) ──
        zypper)
            sudo zypper install -y \
                python3 python3-pip python3-devel \
                git curl wget \
                portaudio-devel libportaudio2 \
                alsa-devel \
                gcc gcc-c++ make \
                xdotool || true
            ;;

        # ── Alpine Linux ──
        apk)
            sudo apk add --no-cache \
                python3 py3-pip python3-dev \
                git curl wget \
                portaudio-dev \
                alsa-lib-dev \
                gcc g++ musl-dev make || true
            ;;

        # ── Void Linux ──
        xbps)
            sudo xbps-install -Sy \
                python3 python3-pip python3-devel \
                git curl wget \
                portaudio-devel \
                alsa-lib-devel \
                gcc make \
                xdotool || true
            ;;

        # ── Gentoo ──
        emerge)
            sudo emerge --ask n \
                dev-lang/python dev-python/pip \
                dev-vcs/git net-misc/curl \
                media-libs/portaudio \
                media-libs/alsa-lib \
                sys-devel/gcc sys-devel/make || true
            ;;

        # ── NixOS / Nix package manager ──
        nix)
            warn "NixOS detected. Please add the following packages to your configuration.nix or use nix-shell:"
            warn "  python3 python3Packages.pip portaudio alsa-lib git xdotool"
            warn "Attempting nix-env install as a fallback (non-NixOS nix users)..."
            nix-env -iA nixpkgs.python3 nixpkgs.portaudio nixpkgs.git nixpkgs.xdotool || true
            ;;

        # ── Legacy RHEL/CentOS yum ──
        yum)
            sudo yum install -y \
                python3 python3-pip python3-devel \
                git curl wget \
                portaudio portaudio-devel \
                alsa-lib-devel \
                gcc gcc-c++ make || true
            ;;

        *)
            warn "Unknown package manager. Skipping automatic system dependency installation."
            warn "Please manually install: python3, pip, portaudio, git, and (optionally) xdotool or ydotool."
            ;;
    esac
}

# Run dependency install, but don't abort if something optional fails
install_system_deps || warn "Some system dependencies may not have installed correctly. Continuing anyway..."
success "System dependency installation complete."
echo ""

# ─────────────────────────────────────────────
# 3. Resolve the Python 3 executable
# ─────────────────────────────────────────────
echo "======================================================"
echo " Step 3: Locating Python 3..."
echo "======================================================"

PYTHON3=""
for candidate in python3 python python3.13 python3.12 python3.11; do
    if command -v "$candidate" &>/dev/null; then
        ver=$("$candidate" -c "import sys; print(sys.version_info >= (3,11))" 2>/dev/null || echo "False")
        if [ "$ver" = "True" ]; then
            PYTHON3="$candidate"
            break
        fi
    fi
done

if [ -z "$PYTHON3" ]; then
    error "Python 3.11 or newer not found! Please install Python 3.11+ and re-run this script."
    exit 1
fi

PY_VERSION=$("$PYTHON3" --version 2>&1)
success "Using $PYTHON3 ($PY_VERSION)"
echo ""

# ─────────────────────────────────────────────
# 4. Create install directory & clone/copy files
# ─────────────────────────────────────────────
echo "======================================================"
echo " Step 4: Installing WoiceFlow application files..."
echo "======================================================"

mkdir -p "$INSTALL_DIR"

# Try to copy from current directory first (running from source checkout)
if cp -r src/ main.py pyproject.toml "$INSTALL_DIR/" 2>/dev/null; then
    # Copy .env only if it exists
    [ -f .env ] && cp .env "$INSTALL_DIR/"
    success "Copied application files from current directory."
else
    # Otherwise clone from GitHub
    info "Source files not found locally. Cloning WoiceFlow from GitHub..."
    if ! command -v git &>/dev/null; then
        error "Git is not installed. Please install git and re-run this script."
        exit 1
    fi
    if [ -d "$INSTALL_DIR/.git" ]; then
        info "Updating existing installation..."
        git -C "$INSTALL_DIR" pull --ff-only
    else
        git clone https://github.com/NoahMenezes/WoiceFlow.git "$INSTALL_DIR"
    fi
    success "WoiceFlow cloned from GitHub."
fi

# Create a default .env if one does not exist
if [ ! -f "$INSTALL_DIR/.env" ]; then
    cat > "$INSTALL_DIR/.env" <<'ENVEOF'
HF_TOKEN=
WOICEFLOW_MODEL_SIZE=base
WOICEFLOW_DEVICE=cpu
WOICEFLOW_COMPUTE_TYPE=int8
ENVEOF
    info "Created default .env file. Edit $INSTALL_DIR/.env to customise settings."
fi
echo ""

# ─────────────────────────────────────────────
# 5. Set up Python virtual environment
# ─────────────────────────────────────────────
echo "======================================================"
echo " Step 5: Setting up Python virtual environment..."
echo "======================================================"

cd "$INSTALL_DIR"

# Create venv — handle the case where 'ensurepip' is missing on some distros
if ! "$PYTHON3" -m venv .venv 2>/dev/null; then
    warn "venv creation failed. Trying with --without-pip flag..."
    "$PYTHON3" -m venv --without-pip .venv
    # Bootstrap pip manually
    curl -sSL https://bootstrap.pypa.io/get-pip.py | .venv/bin/python
fi

source .venv/bin/activate

# Upgrade pip to latest
pip install --upgrade pip --quiet

# Install all Python dependencies
info "Installing Python packages (this may take a few minutes)..."
pip install faster-whisper loguru numpy pynput pyqt6 rich scipy sounddevice ollama

# Install the woiceflow package itself in editable mode
pip install -e . --quiet

success "Python environment ready."
echo ""

# ─────────────────────────────────────────────
# 6. Create the wrapper startup script
# ─────────────────────────────────────────────
echo "======================================================"
echo " Step 6: Creating startup wrapper script..."
echo "======================================================"

cat > "$INSTALL_DIR/woiceflow.sh" << 'WRAPEOF'
#!/bin/bash
# WoiceFlow startup wrapper
# Waits for the graphical session to fully initialize, then launches the app.

# Give the desktop environment time to settle after login
sleep 5

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

# Activate the virtual environment
source .venv/bin/activate

# Log output to a file for easy debugging
LOG_FILE="$HOME/.local/share/woiceflow/woiceflow.log"
mkdir -p "$(dirname "$LOG_FILE")"

echo "[$(date)] WoiceFlow starting..." >> "$LOG_FILE"
exec python main.py >> "$LOG_FILE" 2>&1
WRAPEOF
chmod +x "$INSTALL_DIR/woiceflow.sh"
success "Wrapper script created at $INSTALL_DIR/woiceflow.sh"
echo ""

# ─────────────────────────────────────────────
# 7. Register systemd user service (autostart)
# ─────────────────────────────────────────────
echo "======================================================"
echo " Step 7: Registering systemd autostart service..."
echo "======================================================"

if command -v systemctl &>/dev/null && systemctl --user status &>/dev/null 2>&1; then
    mkdir -p "$SYSTEMD_USER_DIR"

    cat > "$SYSTEMD_USER_DIR/${SERVICE_NAME}.service" << EOF
[Unit]
Description=WoiceFlow Voice Dictation
Documentation=https://github.com/NoahMenezes/WoiceFlow
# Start after the graphical session is ready
After=graphical-session.target
Wants=graphical-session.target

[Service]
Type=simple
ExecStart=${INSTALL_DIR}/woiceflow.sh
Restart=on-failure
RestartSec=5s
# Pass through display and Wayland session variables
Environment=DISPLAY=:0
PassEnvironment=DISPLAY WAYLAND_DISPLAY XDG_RUNTIME_DIR DBUS_SESSION_BUS_ADDRESS XAUTHORITY
# Capture logs — view with: journalctl --user -u woiceflow -f
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=default.target
EOF

    systemctl --user daemon-reload
    # Import current session variables so the service can access the display
    systemctl --user import-environment DISPLAY WAYLAND_DISPLAY XDG_RUNTIME_DIR DBUS_SESSION_BUS_ADDRESS XAUTHORITY 2>/dev/null || true
    systemctl --user enable "${SERVICE_NAME}.service"
    systemctl --user restart "${SERVICE_NAME}.service"

    success "systemd user service enabled and started."
else
    # Fallback: XDG autostart .desktop file (works on GNOME, KDE, XFCE, etc.)
    warn "systemd --user not available. Using XDG autostart fallback."
    AUTOSTART_DIR="$HOME/.config/autostart"
    mkdir -p "$AUTOSTART_DIR"
    cat > "$AUTOSTART_DIR/woiceflow.desktop" << EOF
[Desktop Entry]
Type=Application
Name=WoiceFlow
Comment=Voice Dictation Tool
Exec=${INSTALL_DIR}/woiceflow.sh
Icon=microphone-sensitivity-high-symbolic
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
EOF
    success "XDG autostart entry created at $AUTOSTART_DIR/woiceflow.desktop"

    # Start now in background
    nohup "$INSTALL_DIR/woiceflow.sh" &>/dev/null &
    success "WoiceFlow launched in the background."
fi

echo ""

# ─────────────────────────────────────────────
# 8. Wayland / ydotool reminder
# ─────────────────────────────────────────────
SESSION_TYPE="${XDG_SESSION_TYPE:-unknown}"
if [ "$SESSION_TYPE" = "wayland" ]; then
    echo "======================================================"
    echo " ℹ️  Wayland Session Detected"
    echo "======================================================"
    if ! command -v ydotool &>/dev/null; then
        echo ""
        echo "  ydotool is not installed. WoiceFlow will use pynput as a fallback"
        echo "  for text injection, which works for most apps."
        echo ""
        echo "  For best Wayland compatibility (especially in native Wayland apps),"
        echo "  install ydotool from your package manager:"
        echo ""
        case "$PKG_MANAGER" in
            apt)    echo "    sudo apt-get install ydotool" ;;
            dnf)    echo "    sudo dnf install ydotool" ;;
            pacman) echo "    yay -S ydotool  (or paru -S ydotool)" ;;
            zypper) echo "    sudo zypper install ydotool" ;;
            *)      echo "    https://github.com/ReimuNotMoe/ydotool" ;;
        esac
        echo ""
    else
        success "ydotool is installed — full Wayland text injection supported."
    fi
fi

# ─────────────────────────────────────────────
# Done
# ─────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  ✅  WoiceFlow installed successfully!               ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "  Press F9 anywhere to start/stop voice dictation."
echo ""
echo "📋 Useful commands:"
if command -v systemctl &>/dev/null && systemctl --user status woiceflow &>/dev/null 2>&1; then
    echo "  View live logs:   journalctl --user -u woiceflow -f"
    echo "  Check status:     systemctl --user status woiceflow"
    echo "  Restart:          systemctl --user restart woiceflow"
    echo "  Stop:             systemctl --user stop woiceflow"
    echo "  Disable autostart: systemctl --user disable woiceflow"
else
    echo "  View logs:        cat $HOME/.local/share/woiceflow/woiceflow.log"
    echo "  Run manually:     $INSTALL_DIR/woiceflow.sh"
fi
echo ""
echo "  Settings file:    $INSTALL_DIR/.env"
echo ""
