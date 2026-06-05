#!/bin/bash
# macOS Build & Packaging Script for WoiceFlow

set -e

echo "📦 Building WoiceFlow executable for macOS using PyInstaller..."
if ! command -v pyinstaller &> /dev/null; then
    echo "PyInstaller not found. Installing..."
    pip install pyinstaller
fi

# Build macOS .app bundle
pyinstaller --noconfirm --onedir --windowed --name "WoiceFlow" main.py

echo "🛠️ Creating macOS Installer Script..."
mkdir -p dist/WoiceFlow_macOS_Installer

# Create the install script that the end-user will run
cat << 'EOF' > dist/WoiceFlow_macOS_Installer/install.command
#!/bin/bash
set -e
echo "Installing WoiceFlow..."

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Copy App to Applications
cp -R "$DIR/WoiceFlow.app" /Applications/

# Create LaunchAgent for Autostart
mkdir -p ~/Library/LaunchAgents
cat << 'PLIST' > ~/Library/LaunchAgents/com.woiceflow.app.plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.woiceflow.app</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Applications/WoiceFlow.app/Contents/MacOS/WoiceFlow</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
PLIST

# Load the LaunchAgent
launchctl load ~/Library/LaunchAgents/com.woiceflow.app.plist || true

echo "✅ Installation Complete! WoiceFlow is now running in the background."
echo "It will automatically start when you log in. Press F9 anywhere to use it."
EOF

chmod +x dist/WoiceFlow_macOS_Installer/install.command
cp -R dist/WoiceFlow.app dist/WoiceFlow_macOS_Installer/

# Package into a dmg-like zip
cd dist
zip -r WoiceFlow_macOS_Installer.zip WoiceFlow_macOS_Installer
cd ..

echo "✅ macOS build complete. Distribute: dist/WoiceFlow_macOS_Installer.zip"
