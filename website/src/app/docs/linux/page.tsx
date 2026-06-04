import React from 'react';
import { Cpu, Terminal, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LinuxDocs() {
  return (
    <div className="space-y-10 max-w-4xl">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#85AB8B]/10 border border-[#85AB8B]/20">
          <Cpu className="w-4 h-4 text-[#85AB8B]" />
          <span className="text-xs font-bold text-[#85AB8B] uppercase tracking-wider">Recommended Setup</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Linux Installation</h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          WoiceFlow runs natively on Linux (optimized for Fedora and Ubuntu running GNOME on Wayland/X11). The installer registers autostart utilities so that the dictation system is active immediately when you boot.
        </p>
      </div>

      {/* One Command Installer */}
      <div className="p-6 rounded-2xl border border-[#85AB8B]/20 bg-[#85AB8B]/5 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#85AB8B]" /> One-Command Automated Installer
        </h2>
        <p className="text-sm text-slate-300">
          Execute this script to download, configure dependencies, set up virtual environment paths, and enable background auto-boot:
        </p>
        <div className="rounded-xl bg-black/60 border border-white/10 p-4 font-mono text-sm text-emerald-400 select-all overflow-x-auto">
          curl -sSL https://raw.githubusercontent.com/NoahMenezes/WoiceFlow/main/install_linux.sh | bash
        </div>
      </div>

      {/* Installation Breakdown */}
      <div className="space-y-6 pt-6 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white tracking-tight">What the Installer Does</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#85AB8B]" /> 1. Dependency Resolution
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects your package manager (DNF, APT, PACMAN) and automatically installs Python3 headers, virtual environments (`python3-venv`), and audio libraries like `portaudio-devel` or `libasound2-dev`.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#85AB8B]" /> 2. Local VirtualEnv
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Builds a secure local Python sandbox under your home directory, avoiding system package contamination. Installs PyKeyboard drivers, Faster-Whisper, and PyQt6.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#85AB8B]" /> 3. GNOME Autostart
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Creates a custom desktop file in `~/.config/autostart/woiceflow.desktop` which executes the launcher shell wrapper, running silently inside the user session.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#85AB8B]" /> 4. Global Input Hooks
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Registers event listeners using python&apos;s `pynput` library. The system triggers the dictation overlay without requiring root permissions or container escapes.
            </p>
          </div>
        </div>
      </div>

      {/* Manual Configuration & Troubleshooting */}
      <div className="space-y-6 pt-6 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white tracking-tight">Post-Install Verification</h2>
        <div className="space-y-4">
          <p className="text-slate-300 text-sm leading-relaxed">
            By default, WoiceFlow is running in the background. Press and hold <kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-xs">F9</kbd> while speaking, and let go to trigger automatic speech-to-text translation directly into the active terminal, editor, or browser.
          </p>
          <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 flex gap-3 text-xs text-amber-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <span className="font-bold block mb-1">Wayland Clipboard Permission Warning</span>
              On Wayland sessions, certain flatpaks or sandboxed applications might block synthetic keyboard event insertion. If keyboard injection does not output text, review your active application policies or switch to X11-compatible keyboard fallback configurations in your `config.json`.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
