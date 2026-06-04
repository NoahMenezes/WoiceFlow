#!/bin/bash
# WoiceFlow Linux Installer
# Sets up WoiceFlow to run automatically in the background on Linux

set -e

INSTALL_DIR="$HOME/.local/share/woiceflow"
AUTOSTART_DIR="$HOME/.config/autostart"

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
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"
source .venv/bin/activate
exec python main.py >/dev/null 2>&1
EOF
chmod +x "$INSTALL_DIR/woiceflow.sh"

# 4. Set up Python virtual environment and install dependencies
cd "$INSTALL_DIR"
echo "Setting up Python virtual environment..."
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install faster-whisper loguru numpy pynput pyqt6 rich scipy sounddevice

# 5. Create Desktop Autostart Entry
echo "Registering autostart shortcut..."
mkdir -p "$AUTOSTART_DIR"
cat << EOF > "$AUTOSTART_DIR/woiceflow.desktop"
[Desktop Entry]
Type=Application
Exec=$INSTALL_DIR/woiceflow.sh
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
Name=WoiceFlow
Comment=Start WoiceFlow Voice Dictation in the background
Terminal=false
EOF

# 6. Start the daemon right now
echo "Starting WoiceFlow in the background..."
nohup ./woiceflow.sh >/dev/null 2>&1 &

echo "✅ Installation successful! WoiceFlow is running in the background."
echo "Press F9 anywhere on your system to start dictation."
EOF
