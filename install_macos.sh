#!/bin/bash
# WoiceFlow macOS Installer
# Sets up WoiceFlow to run automatically in the background on macOS

set -e

INSTALL_DIR="$HOME/Library/Application Support/woiceflow"
LAUNCH_AGENTS_DIR="$HOME/Library/LaunchAgents"

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
pip install -e .

# 5. Create macOS LaunchAgent for Autostart
echo "Registering LaunchAgent..."
mkdir -p "$LAUNCH_AGENTS_DIR"
cat << EOF > "$LAUNCH_AGENTS_DIR/com.woiceflow.app.plist"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.woiceflow.app</string>
    <key>ProgramArguments</key>
    <array>
        <string>$INSTALL_DIR/woiceflow.sh</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
EOF

# 6. Start the daemon right now
echo "Starting WoiceFlow in the background..."
launchctl unload "$LAUNCH_AGENTS_DIR/com.woiceflow.app.plist" 2>/dev/null || true
launchctl load "$LAUNCH_AGENTS_DIR/com.woiceflow.app.plist"

echo "✅ Installation successful! WoiceFlow is running in the background."
echo "Press F9 anywhere on your system to start dictation."

