@echo off
:: Windows Build & Packaging Script for WoiceFlow

echo 📦 Building WoiceFlow executable for Windows using PyInstaller...

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in your PATH.
    exit /b 1
)

:: Ensure PyInstaller is installed
python -m PyInstaller --version >nul 2>&1
if %errorlevel% neq 0 (
    echo PyInstaller not found. Installing...
    pip install pyinstaller
)

:: Build single directory application
echo Running PyInstaller...
python -m PyInstaller --noconfirm --onedir --windowed --name "WoiceFlow" main.py

if %errorlevel% neq 0 (
    echo Error: PyInstaller build failed.
    exit /b %errorlevel%
)

echo.
echo 🛠️ Packaging installer with Inno Setup...
:: Check if Inno Setup compiler (iscc) is in PATH
where iscc >nul 2>&1
if %errorlevel% eq 0 (
    iscc woiceflow-setup.iss
    echo ✅ Windows build and installer package complete.
    echo Distribute: installers\windows\WoiceFlow-Windows-Setup.exe
) else (
    echo Inno Setup Compiler (iscc) not found in PATH.
    echo Standalone executable is available at: dist\WoiceFlow\WoiceFlow.exe
    echo To build the setup installer, install Inno Setup and run:
    echo   iscc woiceflow-setup.iss
)
