#!/bin/bash
# Linux Build & Packaging Script for WoiceFlow

set -e

echo "📦 Building WoiceFlow executable for Linux using PyInstaller..."
# Ensure pyinstaller is installed
if ! command -v pyinstaller &> /dev/null; then
    echo "PyInstaller not found. Installing..."
    pip install pyinstaller
fi

# Build single directory application
pyinstaller --noconfirm --onedir --windowed --name "WoiceFlow" main.py

echo "🛠️ Creating Linux Installer..."
mkdir -p dist/WoiceFlow_Linux_Installer

# Create the install script that the end-user will run
cat << 'EOF' > dist/WoiceFlow_Linux_Installer/install.sh
#!/bin/bash
set -e
echo "Installing WoiceFlow..."

# Copy executable to user's local bin
mkdir -p ~/.local/bin/WoiceFlowApp
cp -r ../WoiceFlow/* ~/.local/bin/WoiceFlowApp/

# Ensure executable permissions
chmod +x ~/.local/bin/WoiceFlowApp/WoiceFlow

# Create Autostart Entry
mkdir -p ~/.config/autostart
cat << 'APP' > ~/.config/autostart/woiceflow.desktop
[Desktop Entry]
Type=Application
Exec=/home/$USER/.local/bin/WoiceFlowApp/WoiceFlow
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
Name=WoiceFlow
Comment=Start WoiceFlow Voice Dictation in the background
Terminal=false
APP

# Start the application immediately
~/.local/bin/WoiceFlowApp/WoiceFlow > /dev/null 2>&1 &

echo "✅ Installation Complete! WoiceFlow is now running in the background."
echo "It will automatically start when you log in. Press F9 anywhere to use it."
EOF

chmod +x dist/WoiceFlow_Linux_Installer/install.sh
cp -r dist/WoiceFlow dist/WoiceFlow_Linux_Installer/

# Package into a tarball
cd dist
tar -czvf WoiceFlow_Linux_Installer.tar.gz WoiceFlow_Linux_Installer
cd ..

echo "✅ Linux build complete. Distribute: dist/WoiceFlow_Linux_Installer.tar.gz"
