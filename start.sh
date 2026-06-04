#!/bin/bash
# WoiceFlow Development Launcher

# Resolve directory of this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

# Activate Python virtual environment if available
if [ -d ".venv" ]; then
    source .venv/bin/activate
fi

# Start the Python Speech Recognition Engine
echo "🎙️ Starting WoiceFlow local speech engine..."
python main.py
