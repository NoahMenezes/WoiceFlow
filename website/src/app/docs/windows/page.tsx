import React from 'react';
import { Terminal, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function WindowsDocs() {
  return (
    <div className="space-y-12 max-w-4xl scroll-smooth">
      {/* Overview Section */}
      <section id="overview" className="space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#85AB8B]/10 border border-[#85AB8B]/20">
          <Terminal className="w-4 h-4 text-[#85AB8B]" />
          <span className="text-xs font-bold text-[#85AB8B] uppercase tracking-wider">Windows Installation</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Windows Installation Guide</h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          On Windows, WoiceFlow runs as a lightweight background process. The automated installer configures a Python virtual environment, installs local dependencies, and creates autostart entries to run silently on boot.
        </p>
      </section>

      {/* Quick Install Section */}
      <section id="install" className="space-y-4 pt-6 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#85AB8B]" /> One-Command Installation
        </h2>
        <p className="text-sm text-slate-300">
          Open Command Prompt (CMD) or PowerShell and run the following command to download and run the installer:
        </p>
        <div className="space-y-3 font-mono text-sm text-emerald-400 select-all bg-black/60 border border-white/10 p-5 rounded-2xl overflow-x-auto">
          <div>curl -sSL -o install_windows.bat https://raw.githubusercontent.com/NoahMenezes/WoiceFlow/main/install_windows.bat && install_windows.bat</div>
        </div>
        <p className="text-xs text-slate-400">
          This command downloads the official <code className="text-slate-200">install_windows.bat</code> script and executes it locally.
        </p>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="space-y-4 pt-6 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white tracking-tight">What the Installer Does</h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          The installer automates the setup process to ensure a clean, isolated local installation:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#85AB8B]" /> 1. Installs Python
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              If Python is not found, the script uses Windows Package Manager (<code className="text-slate-200">winget</code>) to download and install Python 3.12 automatically.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#85AB8B]" /> 2. Copies App Files
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Creates a local folder under <code className="text-slate-200">%APPDATA%\woiceflow</code> and copies all necessary modules and entry scripts.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#85AB8B]" /> 3. Configures Virtual Environment
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Initializes a Python virtual environment (<code className="text-slate-200">.venv</code>) and installs all offline speech processing and typing dependencies.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#85AB8B]" /> 4. Configures Silent Autostart
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Creates a startup shortcut linked to <code className="text-slate-200">pythonw.exe</code>, which executes WoiceFlow silently in the background without spawning command prompt windows.
            </p>
          </div>
        </div>
      </section>

      {/* Troubleshooting Section */}
      <section id="troubleshoot" className="space-y-4 pt-6 border-t border-white/5 pb-12">
        <h2 className="text-2xl font-bold text-white tracking-tight">Windows Troubleshooting</h2>
        <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 flex gap-3 text-xs text-amber-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <span className="font-bold block mb-1">Microphone Access Policy</span>
            If the hotkey does not record or trigger transcription output, ensure that **Microphone access for desktop apps** is turned ON in Windows Settings under Privacy & Security &rarr; Microphone.
          </div>
        </div>
      </section>
    </div>
  );
}
