@echo off
:: WoiceFlow Windows Installer
:: Sets up WoiceFlow to run automatically in the background on Windows
:: Uses a startup shortcut and pythonw.exe for silent execution

setlocal enabledelayedexpansion

echo 🎙️ Installing WoiceFlow...

:: 1. Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Python is not installed or not in your PATH.
    echo Attempting to install Python via winget...
    winget install Python.Python.3.12 --silent --accept-package-agreements --accept-source-agreements
    if !errorlevel! neq 0 (
        echo [ERROR] Winget installation failed. Please install Python manually from https://www.python.org/downloads/ and re-run this script.
        pause
        exit /b 1
    )
    echo [SUCCESS] Python has been installed. Please restart this Command Prompt window and run install_windows.bat again.
    pause
    exit /b 0
)

:: 2. Define Installation Directory
set "INSTALL_DIR=%APPDATA%\woiceflow"
echo Target installation folder: !INSTALL_DIR!

:: Create folder if it doesn't exist
if not exist "!INSTALL_DIR!" mkdir "!INSTALL_DIR!"

:: 3. Copy application files to the installation directory
echo Copying application files...
xcopy /E /I /Y src "!INSTALL_DIR!\src" >nul
copy /Y main.py "!INSTALL_DIR!\" >nul
copy /Y pyproject.toml "!INSTALL_DIR!\" >nul
if exist .env (
    copy /Y .env "!INSTALL_DIR!\" >nul
) else (
    (
    echo HF_TOKEN=
    echo WOICEFLOW_MODEL_SIZE=base
    echo WOICEFLOW_DEVICE=cpu
    echo WOICEFLOW_COMPUTE_TYPE=int8
    ) > "!INSTALL_DIR!\.env"
)

:: 4. Create startup wrapper batch file (runs pythonw.exe to suppress console popup)
echo Creating startup wrapper...
(
echo @echo off
echo cd /d "%%APPDATA%%\woiceflow"
echo start "" "%%APPDATA%%\woiceflow\.venv\Scripts\pythonw.exe" main.py
) > "!INSTALL_DIR!\woiceflow.bat"

:: 5. Set up virtual environment and install dependencies
echo Setting up Python virtual environment...
cd /d "!INSTALL_DIR!"
python -m venv .venv
if %errorlevel% neq 0 (
    echo [ERROR] Failed to create python virtual environment.
    pause
    exit /b 1
)

echo Installing dependencies...
.venv\Scripts\python.exe -m pip install --upgrade pip
.venv\Scripts\python.exe -m pip install faster-whisper loguru numpy pynput pyqt6 rich scipy sounddevice
.venv\Scripts\python.exe -m pip install -e .

:: 6. Create Start Menu Startup Shortcut (for Autostart on login)
echo Registering startup shortcut...
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut(\"$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\WoiceFlow.lnk\"); $Shortcut.TargetPath = \"$env:APPDATA\woiceflow\woiceflow.bat\"; $Shortcut.WorkingDirectory = \"$env:APPDATA\woiceflow\"; $Shortcut.Save()"

:: 7. Create Desktop Shortcut
echo Registering Desktop shortcut...
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut(\"$env:USERPROFILE\Desktop\WoiceFlow.lnk\"); $Shortcut.TargetPath = \"$env:APPDATA\woiceflow\woiceflow.bat\"; $Shortcut.WorkingDirectory = \"$env:APPDATA\woiceflow\"; $Shortcut.Save()"

:: 8. Launch WoiceFlow in background immediately
echo Launching WoiceFlow...
start "" "!INSTALL_DIR!\woiceflow.bat"

echo.
echo ✅ Installation successful! WoiceFlow is running in the background.
echo Press F9 anywhere on your system to start dictation.
echo.
pause
