#!/bin/bash
# WoiceFlow Production Launcher
# Starts both Python Speech Engine daemon and Flutter HUD Overlay UI in one shot

# Terminate all background processes on script exit
trap 'echo "Shutting down WoiceFlow processes..."; kill $(jobs -p) 2>/dev/null' EXIT

# Resolve directory of this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

# Activate Python virtual environment if available
if [ -d ".venv" ]; then
    source .venv/bin/activate
fi

# Start the Python Speech Recognition Engine in the background
echo "🎙️ Starting WoiceFlow local speech engine backend daemon..."
python main.py &
PYTHON_PID=$!

# Wait for Unix/TCP socket to initialize
sleep 1.5

# Check if Python daemon started successfully
if ! kill -0 $PYTHON_PID 2>/dev/null; then
    echo "❌ Error: Python backend failed to start. Check main.log / output above."
    exit 1
fi

echo "✅ Python speech engine active (PID: $PYTHON_PID)"

# Compile and start the Flutter Desktop HUD Application
echo "🖥️ Starting WoiceFlow HUD Overlay interface..."
cd desktop
/home/noah/flutter/bin/flutter run -d linux

# Cleanup on exit
kill $PYTHON_PID 2>/dev/null
