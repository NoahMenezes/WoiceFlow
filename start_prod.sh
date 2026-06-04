#!/bin/bash
# WoiceFlow Production Launcher
# Starts the Python Speech Engine and the compiled Flutter HUD in production mode

# Redirect all output to a log file for debugging in production
exec > >(tee -a /tmp/woiceflow_production.log) 2>&1

echo "Starting WoiceFlow Production Launcher at $(date)"

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
python main.py &
PYTHON_PID=$!

# Wait for Unix/TCP socket to initialize
sleep 2

# Check if Python daemon started successfully
if ! kill -0 $PYTHON_PID 2>/dev/null; then
    echo "Failed to start python backend."
    exit 1
fi

echo "Python backend running with PID: $PYTHON_PID"

# Run the compiled Flutter Desktop HUD Application
cd desktop/build/linux/x64/release/bundle
if [ -x "./woiceflow_desktop" ]; then
    echo "Launching compiled Flutter HUD..."
    ./woiceflow_desktop
else
    echo "Compiled HUD not found, falling back to flutter run..."
    cd ../../../../../
    /home/noah/flutter/bin/flutter run -d linux
fi

# Cleanup on exit
kill $PYTHON_PID 2>/dev/null
