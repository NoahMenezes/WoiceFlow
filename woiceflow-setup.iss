; Inno Setup Script for WoiceFlow Windows Installer
; This script assumes you have run:
; uv run pyinstaller --noconfirm --onedir --windowed --name "WoiceFlow" main.py
; on a Windows machine, resulting in a 'dist\WoiceFlow' directory.

[Setup]
AppId={{2A8A9E31-4B9F-44F0-A1E2-F4A6A8C9D3F8}}
AppName=WoiceFlow
AppVersion=0.1.0
AppPublisher=WoiceFlow Open Source
AppPublisherURL=https://github.com/yourusername/WoiceFlow
AppSupportURL=https://github.com/yourusername/WoiceFlow/issues
AppUpdatesURL=https://github.com/yourusername/WoiceFlow/releases
DefaultDirName={autopf}\WoiceFlow
DefaultGroupName=WoiceFlow
AllowNoIcons=yes
; Output location for the generated setup.exe
OutputDir=installers\windows
OutputBaseFilename=WoiceFlow-Windows-Setup
SetupIconFile=website\public\favicon.ico
Compression=lzma
SolidCompression=yes
WizardStyle=modern

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
; Copy the entire built executable directory
Source: "dist\WoiceFlow\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\WoiceFlow"; Filename: "{app}\WoiceFlow.exe"
Name: "{group}\{cm:UninstallProgram,WoiceFlow}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\WoiceFlow"; Filename: "{app}\WoiceFlow.exe"; Tasks: desktopicon

[Run]
Filename: "{app}\WoiceFlow.exe"; Description: "{cm:LaunchProgram,WoiceFlow}"; Flags: nowait postinstall skipifsilent
