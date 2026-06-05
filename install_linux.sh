#!/bin/bash
# WoiceFlow Linux Installer
# Sets up WoiceFlow to run automatically in the background on Linux
# Uses a systemd user service for reliable autostart after login

set -e

INSTALL_DIR="$HOME/.local/share/woiceflow"
SYSTEMD_USER_DIR="$HOME/.config/systemd/user"
SERVICE_NAME="woiceflow"

echo "🎙️ Installing WoiceFlow..."

# 1. Create install directory
mkdir -p "$INSTALL_DIR"

# 2. Sync project files to the installation directory
echo "Copying application files..."
cp -r src/ main.py pyproject.toml .env "$INSTALL_DIR/" 2>/dev/null || {
    # If not running from the repository root, clone it
    if command -v git &> /dev/null; then
        echo "Cloning latest WoiceFlow from GitHub..."
        git clone https://github.com/NoahMenezes/WoiceFlow.git "$INSTALL_DIR"
    else
        echo "Error: Git is not installed. Please run this script from the WoiceFlow project directory."
        exit 1
    fi
}

# 3. Create a wrapper script to run the virtualenv python
cat << 'EOF' > "$INSTALL_DIR/woiceflow.sh"
#!/bin/bash
# WoiceFlow startup wrapper
# Waits for the graphical session to be fully ready, then launches the app.

# Give the desktop session time to fully initialize
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
EOF
chmod +x "$INSTALL_DIR/woiceflow.sh"

# 4. Set up Python virtual environment and install dependencies
cd "$INSTALL_DIR"
echo "Setting up Python virtual environment..."
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install faster-whisper loguru numpy pynput pyqt6 rich scipy sounddevice
# Install the woiceflow package itself so 'from woiceflow.app import main' resolves
pip install -e .

# 5. Create systemd user service (reliable autostart after graphical login)
echo "Registering systemd user service..."
mkdir -p "$SYSTEMD_USER_DIR"
cat << EOF > "$SYSTEMD_USER_DIR/${SERVICE_NAME}.service"
[Unit]
Description=WoiceFlow Voice Dictation
Documentation=https://github.com/NoahMenezes/WoiceFlow
# Start after the graphical session environment is ready
After=graphical-session.target
Wants=graphical-session.target

[Service]
Type=simple
ExecStart=$INSTALL_DIR/woiceflow.sh
Restart=on-failure
RestartSec=5s
# Pass the graphical session environment through
Environment=DISPLAY=:0
# Capture logs - view with: journalctl --user -u woiceflow -f
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=default.target
EOF

# 6. Enable and start the systemd user service
systemctl --user daemon-reload
systemctl --user import-environment DISPLAY WAYLAND_DISPLAY XDG_RUNTIME_DIR
systemctl --user enable "${SERVICE_NAME}.service"
systemctl --user start "${SERVICE_NAME}.service"

echo ""
echo "✅ Installation successful! WoiceFlow is running in the background."
echo "Press F9 anywhere on your system to start dictation."
echo ""
echo "📋 Useful commands:"
echo "  View live logs:   journalctl --user -u woiceflow -f"
echo "  Check status:     systemctl --user status woiceflow"
echo "  Restart:          systemctl --user restart woiceflow"
echo "  Stop:             systemctl --user stop woiceflow"
