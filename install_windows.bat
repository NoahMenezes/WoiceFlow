@echo off
:: WoiceFlow Windows Installer
:: Supports: Windows 10 (build 19041+) and Windows 11
:: Sets up WoiceFlow to run automatically in the background on login.
:: Uses startup shortcut and pythonw.exe for silent execution.

setlocal enabledelayedexpansion

echo.
echo  ============================================================
echo   WoiceFlow - Windows Installer
echo  ============================================================
echo.

:: ─────────────────────────────────────────────────────────────
:: 1. Check Windows version (warn if too old)
:: ─────────────────────────────────────────────────────────────
echo  [Step 1] Checking Windows version...
for /f "tokens=4-5 delims=. " %%i in ('ver') do set VERSION=%%i.%%j
echo   Detected Windows version: %VERSION%
echo.

:: ─────────────────────────────────────────────────────────────
:: 2. Check/install Python 3.11+
:: ─────────────────────────────────────────────────────────────
echo  [Step 2] Checking for Python 3.11+...

:: Check if python is present and meets minimum version
set "PYTHON_OK=0"
python --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=2 delims= " %%v in ('python --version 2^>^&1') do set "PY_VER=%%v"
    for /f "tokens=1,2 delims=." %%a in ("!PY_VER!") do (
        set "PY_MAJOR=%%a"
        set "PY_MINOR=%%b"
    )
    if !PY_MAJOR! geq 3 (
        if !PY_MINOR! geq 11 (
            echo   Found Python !PY_VER!  OK
            set "PYTHON_OK=1"
        )
    )
)

if "!PYTHON_OK!"=="0" (
    echo   Python 3.11+ not found. Attempting to install via winget...
    echo.
    winget install Python.Python.3.12 --silent --accept-package-agreements --accept-source-agreements
    if !errorlevel! neq 0 (
        echo.
        echo   [ERROR] Automatic Python installation failed.
        echo   Please download and install Python 3.12 manually from:
        echo   https://www.python.org/downloads/
        echo.
        echo   IMPORTANT: Check "Add python.exe to PATH" during installation!
        pause
        exit /b 1
    )
    echo.
    echo   [SUCCESS] Python installed. Please CLOSE this window and re-run install_windows.bat
    echo   in a new Command Prompt so the new PATH takes effect.
    pause
    exit /b 0
)

:: ─────────────────────────────────────────────────────────────
:: 3. Check/install Git (needed for cloning if src is missing)
:: ─────────────────────────────────────────────────────────────
echo.
echo  [Step 3] Checking for Git...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo   Git not found. Attempting to install via winget...
    winget install Git.Git --silent --accept-package-agreements --accept-source-agreements
    if !errorlevel! neq 0 (
        echo   [WARN] Could not auto-install Git. Clone step may fail if src\ is missing.
    ) else (
        echo   [SUCCESS] Git installed.
    )
) else (
    for /f "tokens=1-3" %%a in ('git --version') do echo   Found %%a %%b %%c
)
echo.

:: ─────────────────────────────────────────────────────────────
:: 4. Define Installation Directory
:: ─────────────────────────────────────────────────────────────
echo  [Step 4] Defining installation directory...
set "INSTALL_DIR=%APPDATA%\woiceflow"
echo   Target: !INSTALL_DIR!
if not exist "!INSTALL_DIR!" mkdir "!INSTALL_DIR!"
echo.

:: ─────────────────────────────────────────────────────────────
:: 5. Copy/clone application files
:: ─────────────────────────────────────────────────────────────
echo  [Step 5] Copying application files...

:: Try to copy from the current directory (running from repo checkout)
if exist "src\" (
    xcopy /E /I /Y src "!INSTALL_DIR!\src" >nul
    copy /Y main.py "!INSTALL_DIR!\" >nul
    copy /Y pyproject.toml "!INSTALL_DIR!\" >nul
    if exist .env (
        copy /Y .env "!INSTALL_DIR!\" >nul
    )
    echo   Copied files from local source directory.
) else (
    :: Clone from GitHub
    echo   Source not found locally. Cloning WoiceFlow from GitHub...
    if exist "!INSTALL_DIR!\.git" (
        echo   Updating existing installation...
        git -C "!INSTALL_DIR!" pull --ff-only
    ) else (
        git clone https://github.com/NoahMenezes/WoiceFlow.git "!INSTALL_DIR!"
        if !errorlevel! neq 0 (
            echo   [ERROR] Git clone failed. Please check your internet connection.
            pause
            exit /b 1
        )
    )
    echo   Cloned from GitHub.
)

:: Create a default .env if none exists
if not exist "!INSTALL_DIR!\.env" (
    (
        echo HF_TOKEN=
        echo WOICEFLOW_MODEL_SIZE=base
        echo WOICEFLOW_DEVICE=cpu
        echo WOICEFLOW_COMPUTE_TYPE=int8
    ) > "!INSTALL_DIR!\.env"
    echo   Created default .env file.
)
echo.

:: ─────────────────────────────────────────────────────────────
:: 6. Set up virtual environment & install dependencies
:: ─────────────────────────────────────────────────────────────
echo  [Step 6] Setting up Python virtual environment...
cd /d "!INSTALL_DIR!"

python -m venv .venv
if !errorlevel! neq 0 (
    echo   [ERROR] Failed to create virtual environment.
    pause
    exit /b 1
)
echo   Virtual environment created.
echo.

echo  [Step 7] Installing Python dependencies (this may take a few minutes)...
.venv\Scripts\python.exe -m pip install --upgrade pip --quiet
.venv\Scripts\python.exe -m pip install faster-whisper loguru numpy pynput pyqt6 rich scipy sounddevice
.venv\Scripts\python.exe -m pip install -e . --quiet
echo   All Python dependencies installed.
echo.

:: ─────────────────────────────────────────────────────────────
:: 7. Create startup wrapper batch file
:: ─────────────────────────────────────────────────────────────
echo  [Step 8] Creating startup wrapper...
(
    echo @echo off
    echo cd /d "%%APPDATA%%\woiceflow"
    echo start "" "%%APPDATA%%\woiceflow\.venv\Scripts\pythonw.exe" main.py
) > "!INSTALL_DIR!\woiceflow.bat"
echo   Wrapper created at !INSTALL_DIR!\woiceflow.bat
echo.

:: ─────────────────────────────────────────────────────────────
:: 8. Create Start Menu Startup shortcut (autostart on login)
:: ─────────────────────────────────────────────────────────────
echo  [Step 9] Registering startup shortcut (Start Menu\Startup)...
powershell -NoProfile -Command ^
    "$WshShell = New-Object -ComObject WScript.Shell; " ^
    "$lnkPath = [Environment]::GetFolderPath('Startup') + '\WoiceFlow.lnk'; " ^
    "$Shortcut = $WshShell.CreateShortcut($lnkPath); " ^
    "$Shortcut.TargetPath = '%APPDATA%\woiceflow\woiceflow.bat'; " ^
    "$Shortcut.WorkingDirectory = '%APPDATA%\woiceflow'; " ^
    "$Shortcut.Description = 'WoiceFlow Voice Dictation'; " ^
    "$Shortcut.Save()"
echo   Startup shortcut created.

:: ─────────────────────────────────────────────────────────────
:: 9. Create Desktop shortcut
:: ─────────────────────────────────────────────────────────────
echo.
echo  [Step 10] Creating Desktop shortcut...
powershell -NoProfile -Command ^
    "$WshShell = New-Object -ComObject WScript.Shell; " ^
    "$lnkPath = [Environment]::GetFolderPath('Desktop') + '\WoiceFlow.lnk'; " ^
    "$Shortcut = $WshShell.CreateShortcut($lnkPath); " ^
    "$Shortcut.TargetPath = '%APPDATA%\woiceflow\woiceflow.bat'; " ^
    "$Shortcut.WorkingDirectory = '%APPDATA%\woiceflow'; " ^
    "$Shortcut.Description = 'WoiceFlow Voice Dictation'; " ^
    "$Shortcut.Save()"
echo   Desktop shortcut created.
echo.

:: ─────────────────────────────────────────────────────────────
:: 10. Launch WoiceFlow right now
:: ─────────────────────────────────────────────────────────────
echo  [Step 11] Launching WoiceFlow in the background...
start "" "!INSTALL_DIR!\woiceflow.bat"
echo.

:: ─────────────────────────────────────────────────────────────
:: Done
:: ─────────────────────────────────────────────────────────────
echo  ============================================================
echo   WoiceFlow installed successfully!
echo  ============================================================
echo.
echo   Press F9 anywhere on your system to start voice dictation.
echo.
echo   Useful info:
echo     Settings file:  %APPDATA%\woiceflow\.env
echo     Log file:       %APPDATA%\woiceflow\woiceflow.log (after first run)
echo     Stop:           Close the pythonw.exe process in Task Manager
echo     Uninstall:      Delete %APPDATA%\woiceflow and the Desktop shortcut
echo.
pause
