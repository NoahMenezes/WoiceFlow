import React from 'react';
import { Terminal, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

export default function WindowsDocs() {
  return (
    <div className="space-y-10 max-w-4xl">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#85AB8B]/10 border border-[#85AB8B]/20">
          <Terminal className="w-4 h-4 text-[#85AB8B]" />
          <span className="text-xs font-bold text-[#85AB8B] uppercase tracking-wider">Windows Build & Setup</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Windows Installation</h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          On Windows, WoiceFlow is compiled into a standalone, windowless background binary and packaged using Inno Setup for smooth user distribution. It runs on startup using HKCU registry parameters.
        </p>
      </div>

      {/* Compile block */}
      <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#85AB8B]" /> Compiling with PyInstaller
        </h2>
        <p className="text-sm text-slate-300">
          If building from source on a Windows development system, install dependencies and compile the execution bundles:
        </p>
        <div className="space-y-3 font-mono text-sm text-emerald-400 select-all bg-black/60 border border-white/10 p-4 rounded-xl overflow-x-auto">
          <div>pip install pyinstaller -r requirements.txt</div>
          <div>pyinstaller --noconfirm --onedir --windowed --name &quot;WoiceFlow&quot; main.py</div>
        </div>
      </div>

      {/* Inno Setup Installer */}
      <div className="space-y-6 pt-6 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white tracking-tight">Packaging the Installer (.exe)</h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          WoiceFlow provides an **Inno Setup Script** (`woiceflow-setup.iss`) to compile all files inside the `.\dist\WoiceFlow\` output folder into a portable setup wizard:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
            <h3 className="font-bold text-white text-sm">1. Install Inno Setup</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download and install the Inno Setup Compiler tool from JRSoftware on your Windows build system.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
            <h3 className="font-bold text-white text-sm">2. Compile Script</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open `woiceflow-setup.iss` inside Inno Setup and select **Build &rarr; Compile** (or press F9).
            </p>
          </div>

          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
            <h3 className="font-bold text-white text-sm">3. Setup Distribution</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The finished `WoiceFlow-Windows-Setup.exe` is generated inside the project root folder.
            </p>
          </div>
        </div>
      </div>

      {/* Registry details */}
      <div className="space-y-6 pt-6 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white tracking-tight">System Autostart Registry Configuration</h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          During installation, the installer inserts a boot registry entry. Here is the direct entry config registered in the system registry:
        </p>
        <div className="p-5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-slate-300 overflow-x-auto">
          <span className="text-[#85AB8B] font-semibold">[Registry]</span><br />
          Root: HKA; Subkey: &quot;Software\Microsoft\Windows\CurrentVersion\Run&quot;; ValueType: string; ValueName: &quot;WoiceFlow&quot;; ValueData: &quot;&quot;&quot;&#123;app&#125;\WoiceFlow.exe&quot;&quot;&quot;; Flags: uninsdeletevalue
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="space-y-6 pt-6 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white tracking-tight">Windows Execution Notes</h2>
        <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 flex gap-3 text-xs text-amber-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <span className="font-bold block mb-1">Microphone Access Policy</span>
            Windows Security blocks hardware access for unknown background binaries. If transcription does not occur, ensure that **Microphone access for desktop apps** is turned ON under Settings &rarr; Privacy &rarr; Microphone.
          </div>
        </div>
      </div>
    </div>
  );
}
