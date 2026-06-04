#!/bin/bash
# WoiceFlow Full Installation Script
# This tool sets up the WoiceFlow DictationHUD backend and the Website environments.

set -e

echo "🚀 Starting WoiceFlow Installation..."
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "======================================"
echo "1. Checking System Requirements..."
echo "======================================"

if ! command -v uv &> /dev/null; then
    echo "⚠️  uv is not installed. It is recommended for fast Python setup."
else
    echo "✅ uv is installed."
fi

if ! command -v bun &> /dev/null; then
    echo "⚠️  bun is not installed. Website setup requires bun."
else
    echo "✅ Bun is installed."
fi

echo ""
echo "======================================"
echo "2. Setting up Python Engine Backend..."
echo "======================================"
if command -v uv &> /dev/null; then
    uv sync
else
    echo "Using python3 venv fallback..."
    python3 -m venv .venv
    source .venv/bin/activate
    pip install faster-whisper loguru numpy pynput pyqt6 rich scipy sounddevice
fi

echo ""
echo "======================================"
echo "4. Setting up Next.js Website..."
echo "======================================"
cd website
if command -v bun &> /dev/null; then
    bun install
    bun run build
else
    echo "⏭️  Skipping Website setup (Bun not found in PATH)."
fi
cd ..

echo ""
echo "======================================"
echo "✅ WoiceFlow Installation Complete!"
echo "You can launch the system using: ./start.sh"
echo "======================================"
