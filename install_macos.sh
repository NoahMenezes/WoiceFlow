#!/bin/bash
# WoiceFlow macOS Installer
# Supports: macOS 12 Monterey, 13 Ventura, 14 Sonoma, 15 Sequoia (Intel & Apple Silicon)
# Sets up WoiceFlow to run automatically in the background using a LaunchAgent.

set -e

INSTALL_DIR="$HOME/Library/Application Support/woiceflow"
LAUNCH_AGENTS_DIR="$HOME/Library/LaunchAgents"
PLIST_NAME="com.woiceflow.app"

echo "🎙️  Installing WoiceFlow for macOS..."
echo ""

# ─────────────────────────────────────────────
# Helper utilities
# ─────────────────────────────────────────────
info()    { echo "  [INFO] $*"; }
success() { echo "  ✅ $*"; }
warn()    { echo "  ⚠️  $*"; }
error()   { echo "  ❌ $*" >&2; }

# ─────────────────────────────────────────────
# 1. Check macOS version
# ─────────────────────────────────────────────
echo "======================================================"
echo " Step 1: Checking macOS version..."
echo "======================================================"

MACOS_VERSION=$(sw_vers -productVersion 2>/dev/null || echo "unknown")
MACOS_MAJOR=$(echo "$MACOS_VERSION" | cut -d. -f1)
info "macOS $MACOS_VERSION detected."

if [ "$MACOS_MAJOR" != "unknown" ] && [ "$MACOS_MAJOR" -lt 12 ]; then
    warn "macOS $MACOS_VERSION may not be fully supported. Recommend macOS 12 (Monterey) or newer."
fi

# Detect Apple Silicon vs Intel
ARCH=$(uname -m)
if [ "$ARCH" = "arm64" ]; then
    info "Apple Silicon (M-series) CPU detected."
else
    info "Intel CPU detected."
fi
echo ""

# ─────────────────────────────────────────────
# 2. Install Homebrew (if missing)
# ─────────────────────────────────────────────
echo "======================================================"
echo " Step 2: Checking for Homebrew..."
echo "======================================================"

if ! command -v brew &>/dev/null; then
    info "Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    # Add brew to PATH for Apple Silicon Macs
    if [ "$ARCH" = "arm64" ]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
        # Persist in shell profile
        SHELL_PROFILE="$HOME/.zprofile"
        if ! grep -q "brew shellenv" "$SHELL_PROFILE" 2>/dev/null; then
            echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> "$SHELL_PROFILE"
        fi
    fi
    success "Homebrew installed."
else
    success "Homebrew is already installed."
fi

BREW="$(command -v brew)"
echo ""

# ─────────────────────────────────────────────
# 3. Install system dependencies via Homebrew
# ─────────────────────────────────────────────
echo "======================================================"
echo " Step 3: Installing system dependencies..."
echo "======================================================"

info "Installing Python 3, PortAudio, and Git..."
"$BREW" install python@3.12 portaudio git 2>/dev/null || "$BREW" upgrade python@3.12 portaudio git 2>/dev/null || true

success "System dependencies installed."
echo ""

# ─────────────────────────────────────────────
# 4. Resolve Python executable
# ─────────────────────────────────────────────
echo "======================================================"
echo " Step 4: Locating Python 3..."
echo "======================================================"

# Homebrew puts python3 in versioned paths
PYTHON3=""
for candidate in \
    "$("$BREW" --prefix python@3.12 2>/dev/null)/bin/python3.12" \
    "$("$BREW" --prefix python@3.11 2>/dev/null)/bin/python3.11" \
    python3.12 python3.11 python3 python; do
    if command -v "$candidate" &>/dev/null 2>&1; then
        ver=$("$candidate" -c "import sys; print(sys.version_info >= (3,11))" 2>/dev/null || echo "False")
        if [ "$ver" = "True" ]; then
            PYTHON3="$candidate"
            break
        fi
    fi
done

if [ -z "$PYTHON3" ]; then
    error "Python 3.11+ not found after Homebrew install. Please install Python manually and re-run."
    exit 1
fi

PY_VERSION=$("$PYTHON3" --version 2>&1)
success "Using $PYTHON3 ($PY_VERSION)"
echo ""

# ─────────────────────────────────────────────
# 5. Install app files
# ─────────────────────────────────────────────
echo "======================================================"
echo " Step 5: Installing WoiceFlow application files..."
echo "======================================================"

mkdir -p "$INSTALL_DIR"

if cp -r src/ main.py pyproject.toml "$INSTALL_DIR/" 2>/dev/null; then
    [ -f .env ] && cp .env "$INSTALL_DIR/"
    success "Copied application files from current directory."
else
    info "Source files not found locally. Cloning from GitHub..."
    if [ -d "$INSTALL_DIR/.git" ]; then
        info "Updating existing installation..."
        git -C "$INSTALL_DIR" pull --ff-only
    else
        git clone https://github.com/NoahMenezes/WoiceFlow.git "$INSTALL_DIR"
    fi
    success "WoiceFlow cloned from GitHub."
fi

# Create a default .env if missing
if [ ! -f "$INSTALL_DIR/.env" ]; then
    cat > "$INSTALL_DIR/.env" <<'ENVEOF'
HF_TOKEN=
WOICEFLOW_MODEL_SIZE=base
WOICEFLOW_DEVICE=cpu
WOICEFLOW_COMPUTE_TYPE=int8
ENVEOF
    info "Created default .env — edit $INSTALL_DIR/.env to customise."
fi
echo ""

# ─────────────────────────────────────────────
# 6. Set up Python virtual environment
# ─────────────────────────────────────────────
echo "======================================================"
echo " Step 6: Setting up Python virtual environment..."
echo "======================================================"

cd "$INSTALL_DIR"

"$PYTHON3" -m venv .venv
source .venv/bin/activate

pip install --upgrade pip --quiet

info "Installing Python packages..."
pip install faster-whisper loguru numpy pynput pyqt6 rich scipy sounddevice
pip install -e . --quiet

success "Python environment ready."
echo ""

# ─────────────────────────────────────────────
# 7. Create wrapper startup script
# ─────────────────────────────────────────────
echo "======================================================"
echo " Step 7: Creating startup wrapper script..."
echo "======================================================"

cat > "$INSTALL_DIR/woiceflow.sh" << 'WRAPEOF'
#!/bin/bash
# WoiceFlow macOS startup wrapper

# Give the desktop session time to settle after login
sleep 5

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

source .venv/bin/activate

LOG_FILE="$HOME/Library/Logs/woiceflow.log"
mkdir -p "$(dirname "$LOG_FILE")"

echo "[$(date)] WoiceFlow starting..." >> "$LOG_FILE"
exec python main.py >> "$LOG_FILE" 2>&1
WRAPEOF
chmod +x "$INSTALL_DIR/woiceflow.sh"
success "Wrapper script created."
echo ""

# ─────────────────────────────────────────────
# 8. Register macOS LaunchAgent (autostart)
# ─────────────────────────────────────────────
echo "======================================================"
echo " Step 8: Registering LaunchAgent for autostart..."
echo "======================================================"

mkdir -p "$LAUNCH_AGENTS_DIR"

cat > "$LAUNCH_AGENTS_DIR/${PLIST_NAME}.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${PLIST_NAME}</string>
    <key>ProgramArguments</key>
    <array>
        <string>${INSTALL_DIR}/woiceflow.sh</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>${HOME}/Library/Logs/woiceflow.log</string>
    <key>StandardErrorPath</key>
    <string>${HOME}/Library/Logs/woiceflow.log</string>
    <key>ThrottleInterval</key>
    <integer>5</integer>
</dict>
</plist>
EOF

# Unload any existing version cleanly, then load
launchctl unload "$LAUNCH_AGENTS_DIR/${PLIST_NAME}.plist" 2>/dev/null || true
launchctl load "$LAUNCH_AGENTS_DIR/${PLIST_NAME}.plist"

success "LaunchAgent registered and WoiceFlow started."
echo ""

# ─────────────────────────────────────────────
# 9. macOS Accessibility / Input Monitoring note
# ─────────────────────────────────────────────
echo "======================================================"
echo " ℹ️  macOS Permission Required"
echo "======================================================"
echo ""
echo "  WoiceFlow needs permission to monitor keyboard input globally."
echo "  If prompted, open:"
echo "    System Settings → Privacy & Security → Input Monitoring"
echo "  and enable access for Terminal (or your shell)."
echo ""
echo "  For text injection to work, also enable:"
echo "    System Settings → Privacy & Security → Accessibility"
echo ""

# ─────────────────────────────────────────────
# Done
# ─────────────────────────────────────────────
echo "╔══════════════════════════════════════════════════════╗"
echo "║  ✅  WoiceFlow installed successfully on macOS!      ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "  Press F9 anywhere to start/stop voice dictation."
echo ""
echo "📋 Useful commands:"
echo "  View logs:        tail -f ~/Library/Logs/woiceflow.log"
echo "  Stop service:     launchctl unload ~/Library/LaunchAgents/${PLIST_NAME}.plist"
echo "  Start service:    launchctl load ~/Library/LaunchAgents/${PLIST_NAME}.plist"
echo "  Run manually:     $INSTALL_DIR/woiceflow.sh"
echo "  Settings file:    $INSTALL_DIR/.env"
echo ""
