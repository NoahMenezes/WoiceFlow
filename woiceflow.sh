#!/bin/bash
# WoiceFlow Production Launcher
# Starts the Python Speech Engine in production mode

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

# Start the Python Speech Recognition Engine
python main.py
