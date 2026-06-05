import React from 'react';
import { Terminal, AlertCircle, Sparkles } from 'lucide-react';

export default function WindowsDocs() {
  return (
    <div className="space-y-12 max-w-4xl scroll-smooth">
      {/* Overview Section */}
      <section id="overview" className="space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#85AB8B]/10 border border-[#85AB8B]/20">
          <Terminal className="w-4 h-4 text-[#85AB8B]" />
          <span className="text-xs font-bold text-[#85AB8B] uppercase tracking-wider">Windows Build & Setup</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Windows Installation Guide</h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          On Windows, WoiceFlow runs as a background process. To distribute it efficiently, it can be compiled into a standalone, windowless executable and bundled inside an installer.
        </p>
      </section>

      {/* Compile Section */}
      <section id="compile" className="space-y-4 pt-6 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#85AB8B]" /> Compiling with PyInstaller
        </h2>
        <p className="text-sm text-slate-300">
          To build WoiceFlow as a single bundle from source on Windows, install the project requirements and run PyInstaller:
        </p>
        <div className="space-y-3 font-mono text-sm text-emerald-400 select-all bg-black/60 border border-white/10 p-5 rounded-2xl overflow-x-auto">
          <div>pip install pyinstaller -r requirements.txt</div>
          <div>pyinstaller --noconfirm --onedir --windowed --name &quot;WoiceFlow&quot; main.py</div>
        </div>
        <p className="text-xs text-slate-400">
          The output will be created inside the <code className="text-slate-200">.\dist\WoiceFlow\</code> folder containing all executable libraries.
        </p>
      </section>

      {/* Packaging Section */}
      <section id="packaging" className="space-y-4 pt-6 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white tracking-tight">Packaging the Installer (.exe)</h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          WoiceFlow provides an **Inno Setup Script** (<code className="text-slate-200">woiceflow-setup.iss</code>) to package the PyInstaller output into a standard Windows wizard installer:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
            <h3 className="font-bold text-white text-sm">1. Install Inno Setup</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download and install the Inno Setup Compiler tool from JRSoftware.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
            <h3 className="font-bold text-white text-sm">2. Compile Script</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open <code className="text-slate-200">woiceflow-setup.iss</code> inside Inno Setup and select **Build &rarr; Compile** (or press F9).
            </p>
          </div>

          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
            <h3 className="font-bold text-white text-sm">3. Setup Distribution</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The finished executable installer <code className="text-[#85AB8B]">WoiceFlow-Windows-Setup.exe</code> is compiled in your root directory.
            </p>
          </div>
        </div>
      </section>

      {/* Registry Section */}
      <section id="registry" className="space-y-4 pt-6 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white tracking-tight">Registry Autostart Configuration</h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          The installer automatically registers a startup registry key so that the background process loads silently whenever Windows boots:
        </p>
        <div className="p-5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
          <span className="text-[#85AB8B] font-semibold">[Registry]</span><br />
          Root: HKA; Subkey: &quot;Software\Microsoft\Windows\CurrentVersion\Run&quot;; ValueType: string; ValueName: &quot;WoiceFlow&quot;; ValueData: &quot;&quot;&quot;&#123;app&#125;\WoiceFlow.exe&quot;&quot;&quot;; Flags: uninsdeletevalue
        </div>
      </section>

      {/* Troubleshoot Section */}
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
