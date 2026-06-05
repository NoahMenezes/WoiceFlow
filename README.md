# WoiceFlow 🎙️

**System-wide offline voice dictation for Linux, macOS, and Windows.**

WoiceFlow captures microphone audio via a global hotkey (**F9**), transcribes it locally using [Faster-Whisper](https://github.com/SYSTRAN/faster-whisper), and injects the result directly into whatever window is currently active — no cloud, no subscriptions, no latency.

> Inspired by [Wispr Flow](https://www.wisprflow.ai/). Built for privacy-first users who want speech-to-text that stays on their machine.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Global Hotkey (F9)** | Trigger recording from any app, any window |
| **100% Offline** | Powered by Faster-Whisper — no API keys or internet required |
| **System-wide Injection** | Types transcribed text into any active application |
| **Wayland Native** | Uses `ydotool` + `/dev/uinput` for Wayland/GNOME compatibility |
| **DictationHUD™** | Glassmorphic floating overlay showing real-time recording state |
| **VAD Filtering** | Voice Activity Detection silences noise and ignores empty audio |
| **Audio Pre-filtering** | Bandpass + spectral subtraction removes background noise |
| **Auto-daemon Start** | Automatically starts `ydotoold` if it isn't running |
| **IPC Socket Server** | Unix socket (Linux/macOS) or TCP (Windows) for external integrations |
| **Smart Typo Correction** | Post-transcription correction for technical terms (Next.js, Python, etc.) |

---

## 🗂️ Project Structure

```
WoiceFlow/
│
├── src/
│   └── woiceflow/
│       ├── __init__.py
│       ├── app.py                  # Main app controller & state machine
│       │
│       ├── audio/
│       │   ├── __init__.py
│       │   └── recorder.py         # In-memory microphone recording (sounddevice)
│       │
│       ├── speech/
│       │   ├── __init__.py
│       │   └── whisper_engine.py   # Faster-Whisper transcription engine
│       │
│       ├── hotkeys/
│       │   ├── __init__.py
│       │   ├── listener.py         # Global hotkey listener (pynput)
│       │   └── toggle.py           # IPC socket toggle helper
│       │
│       ├── injector/
│       │   ├── __init__.py
│       │   └── typer.py            # ydotool text injection
│       │
│       └── ui/
│           ├── __init__.py
│           ├── overlay.py          # DictationHUD™ glassmorphic overlay (PyQt6)
│           └── tray.py             # System tray icon
│
├── website/                        # Marketing site (Next.js 16 + Bun)
│
├── main.py                         # Entry point
├── pyproject.toml                  # Python project & dependency manifest
├── uv.lock                         # Locked dependency tree (uv)
├── install_linux.sh                # One-command Linux installer
├── install_macos.sh                # One-command macOS installer
├── build_linux.sh                  # Build distributable Linux package
├── build_macos.sh                  # Build distributable macOS package
├── woiceflow-setup.iss             # Inno Setup script for Windows installer
├── start.sh                        # Development launcher
└── README.md
```

---

## ⚙️ How It Works

```
  [F9 pressed]
       │
       ▼
  HotkeyListener (pynput)
  or IPC Socket toggle
       │
       ▼
  AudioRecorder starts
  (sounddevice → in-memory queue)
       │
       ▼
  [F9 pressed again]
       │
       ▼
  AudioRecorder stops
  → returns numpy float32 array
       │
       ▼
  WhisperEngine.transcribe()
  - Bandpass filter (150–3400 Hz)
  - Spectral subtraction (noise removal)
  - Faster-Whisper (VAD + beam search)
  - Typo correction pass
       │
       ▼
  TextInjector.inject()
  (ydotool type → active window)
       │
       ▼
  DictationHUD™ updates state
  (idle → recording → transcribing → done)
```

---

## 🚀 Quick Install (Recommended)

The fastest way to get WoiceFlow running silently in the background on your system.

### 🐧 Linux

```bash
curl -sSL https://raw.githubusercontent.com/NoahMenezes/WoiceFlow/main/install_linux.sh | bash
```

This will:
1. Clone the latest WoiceFlow from GitHub into `~/.local/share/woiceflow`
2. Create a Python virtual environment and install all dependencies
3. Register WoiceFlow as a GNOME autostart application
4. Start WoiceFlow immediately in the background

### 🍏 macOS

```bash
curl -sSL https://raw.githubusercontent.com/NoahMenezes/WoiceFlow/main/install_macos.sh | bash
```

This will:
1. Clone WoiceFlow into `~/Library/Application Support/woiceflow`
2. Create a Python virtual environment and install all dependencies
3. Register a `launchd` LaunchAgent so WoiceFlow starts on login
4. Start WoiceFlow immediately

### 🪟 Windows

1. Install [Python 3.11+](https://www.python.org/downloads/).
2. Build the standalone executable. You can either use the automated script:
   ```cmd
   build_windows.bat
   ```
   Or run it manually (using `python -m PyInstaller` ensures it runs correctly even if PyInstaller is not in your system PATH):
   ```cmd
   pip install pyinstaller
   python -m PyInstaller --noconfirm --onedir --windowed --name "WoiceFlow" main.py
   ```
3. Install [Inno Setup](https://jrsoftware.org/isinfo.php), then compile the installer:
   ```cmd
   iscc woiceflow-setup.iss
   ```
   This produces `WoiceFlow-Windows-Setup.exe` inside the `installers/windows` folder.
4. Run the installer. WoiceFlow will be added to Windows Startup and run silently on boot.

---

## 🛠️ Developer Setup

For contributors or anyone wanting to run from source.

### Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Python | ≥ 3.14 | As declared in `pyproject.toml` |
| `uv` | Latest | Recommended package manager |
| `ydotool` + `ydotoold` | Any | Required on Linux/Wayland for text injection |

### 1. Clone the repository

```bash
git clone https://github.com/NoahMenezes/WoiceFlow.git
cd WoiceFlow
```

### 2. Install dependencies

**Using `uv` (recommended):**
```bash
uv sync
```

**Using pip (fallback):**
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install faster-whisper loguru numpy pynput pyqt6 rich scipy sounddevice
```

### 3. Install the package in editable mode

```bash
uv pip install -e .
```

### 4. (Linux only) Ensure `ydotoold` is running

WoiceFlow will attempt to start this automatically, but you can start it manually:
```bash
ydotoold --socket-path=/run/user/1000/.ydotool_socket &
```

### 5. Run the application

```bash
.venv/bin/python main.py
# or using the start script:
./start.sh
```

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `faster-whisper` | Local speech-to-text via CTranslate2-optimized Whisper |
| `sounddevice` | Low-level microphone audio capture |
| `numpy` | Audio data manipulation (float32 arrays) |
| `scipy` | Bandpass filtering and spectral subtraction |
| `pyqt6` | DictationHUD™ overlay and system tray |
| `pynput` | Global keyboard hotkey listener |
| `loguru` | Structured application logging |
| `rich` | Formatted terminal output |

---

## ⚙️ Configuration

WoiceFlow reads configuration from a `.env` file in the project root. Create one by copying the example:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|---|---|---|
| `WOICEFLOW_MODEL_SIZE` | `base` | Whisper model size (`tiny`, `base`, `small`, `medium`, `large-v3`) |
| `WOICEFLOW_DEVICE` | `cpu` | Inference device (`cpu` or `cuda`) |
| `WOICEFLOW_COMPUTE_TYPE` | `int8` | CTranslate2 compute type (`int8`, `float16`, `float32`) |
| `WOICEFLOW_KEY_DELAY` | `2` | Milliseconds between keystrokes during injection |
| `WOICEFLOW_KEY_HOLD` | `1` | Millisecond key hold duration |
| `HF_TOKEN` | *(empty)* | Hugging Face token (required only for gated models) |

### Whisper Model Size Guide

| Model | Size | Speed | Accuracy |
|---|---|---|---|
| `tiny` | ~70 MB | Fastest | Lower |
| `base` | ~140 MB | Fast | Good (default) |
| `small` | ~460 MB | Moderate | Better |
| `medium` | ~1.5 GB | Slower | High |
| `large-v3` | ~3 GB | Slowest | Best |

---

## 🎮 Usage

1. **Start WoiceFlow** (or let it autostart on login after installation).
2. **Focus any text field** — in a browser, terminal, code editor, or any app.
3. **Press F9** to begin recording. The DictationHUD overlay will appear.
4. **Speak clearly** into your microphone.
5. **Press F9 again** to stop. WoiceFlow will transcribe and type the text instantly.

### State Indicators

| State | HUD Display | Console |
|---|---|---|
| Ready | Hidden | `Ready! Press F9 to record.` |
| Recording | 🔴 `Recording...` | `🔴 Recording... Speak now.` |
| Transcribing | ⏳ `Processing...` | `⏳ Processing audio...` |
| Done | ✨ Preview of text | `✅ Text injected successfully!` |
| Error | ❌ Error message | Details printed to console |

---

## 🌐 Website

The WoiceFlow marketing site is a separate Next.js 16 app located in the `website/` directory.

```bash
cd website
bun install
bun run dev      # Development server at http://localhost:3000
bun run build    # Production build
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push and open a pull request

Please keep commits focused and write clear descriptions.

---

## 📄 License

WoiceFlow is open source. See [LICENSE](LICENSE) for details.

---

<div align="center">
  <sub>Built for Linux power users who think faster than they type.</sub>
</div>
