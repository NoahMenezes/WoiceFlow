# WoiceFlow

WoiceFlow is a system-wide, offline voice dictation application for Fedora Linux (Wayland), heavily inspired by Wispr Flow. It captures microphone audio globally via a system hotkey, transcribes it using `Faster-Whisper` locally on your CPU, and automatically injects (types) the transcribed text into whichever window is currently active using `ydotool`.

## Features

- **Global Hotkey (F9):** Press F9 to toggle recording globally across any desktop application.
- **Local & Offline Speech-to-Text:** Powered by Faster-Whisper, no API keys or cloud services required.
- **System-wide Text Injection:** Functions seamlessly on Wayland utilizing `ydotool` and the `/dev/uinput` layer.
- **Low Latency & High Accuracy:** Zero disk-write overhead (records directly to memory), pre-loads the transcription model on startup, and utilizes Voice Activity Detection (VAD) to ignore noise.

---

## Folder Structure

```
WoiceFlow/
│
├── src/
│   └── woiceflow/
│       ├── __init__.py
│       ├── app.py              # Application controller & state machine
│       ├── audio/
│       │   ├── __init__.py
│       │   └── recorder.py     # sounddevice in-memory recording
│       ├── speech/
│       │   ├── __init__.py
│       │   └── whisper_engine.py # Faster-Whisper local engine
│       ├── hotkeys/
│       │   ├── __init__.py
│       │   └── listener.py     # pynput keyboard listener
│       ├── injector/
│       │   ├── __init__.py
│       │   └── typer.py        # ydotool text typing injector
│       └── ui/
│           ├── __init__.py
│           └── tray.py         # PyQt6 system tray UI skeleton
│
├── pyproject.toml
├── uv.lock
├── main.py                     # Primary entry point
└── README.md
```

---

## Setup & Running

### 1. Ensure `ydotoold` is running
`ydotool` requires a background daemon (`ydotoold`) to communicate with `/dev/uinput`. Start it with:
```bash
ydotoold --socket-path=/run/user/1000/.ydotool_socket &
```

### 2. Sync Dependencies (using uv)
```bash
uv sync
```

### 3. Install Package (editable mode)
Ensure the package is recognized globally inside the virtual environment:
```bash
uv pip install -e .
```

### 4. Execute the Application
```bash
.venv/bin/python main.py
```

---

## Usage Workflow

1. Start the app. Wait for `Faster-Whisper model 'base' loaded successfully` in the logs.
2. In any application (e.g. browser, text editor, terminal), press **F9** once to start recording.
3. Speak clearly into your microphone.
4. Press **F9** again when done.
5. The audio is transcribed locally, and injected into the active text area.
