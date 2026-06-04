import React from 'react';
import { Cpu, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LinuxDocs() {
  return (
    <div className="space-y-12 max-w-4xl scroll-smooth">
      {/* Overview Section */}
      <section id="overview" className="space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#85AB8B]/10 border border-[#85AB8B]/20">
          <Cpu className="w-4 h-4 text-[#85AB8B]" />
          <span className="text-xs font-bold text-[#85AB8B] uppercase tracking-wider">Recommended Setup</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Linux Installation</h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          WoiceFlow runs natively on Linux (optimized for Fedora and Ubuntu running GNOME on Wayland/X11). The installer registers autostart utilities so that the dictation system is active immediately when you boot.
        </p>
      </section>

      {/* Installer Section */}
      <section id="installer" className="space-y-4 pt-6 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#85AB8B]" /> One-Command Automated Installer
        </h2>
        <p className="text-sm text-slate-300">
          Execute this script to download, configure dependencies, set up virtual environment paths, and enable background auto-boot:
        </p>
        <div className="rounded-xl bg-black/60 border border-white/10 p-4 font-mono text-sm text-emerald-400 select-all overflow-x-auto">
          curl -sSL https://raw.githubusercontent.com/NoahMenezes/WoiceFlow/main/install_linux.sh | bash
        </div>
      </section>

      {/* GNOME Section */}
      <section id="gnome" className="space-y-4 pt-6 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white tracking-tight">GNOME Autostart Service</h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          The installation automatically creates a custom desktop entry in <code className="text-slate-200">~/.config/autostart/woiceflow.desktop</code>:
        </p>
        <div className="p-5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
          [Desktop Entry]<br />
          Type=Application<br />
          Exec=/home/YOUR_USER/.woiceflow/woiceflow.sh<br />
          Hidden=false<br />
          NoDisplay=false<br />
          X-GNOME-Autostart-enabled=true<br />
          Name=WoiceFlow<br />
          Comment=Launch WoiceFlow offline dictation HUD
        </div>
      </section>

      {/* Troubleshooting Section */}
      <section id="troubleshooting" className="space-y-4 pt-6 border-t border-white/5 pb-12">
        <h2 className="text-2xl font-bold text-white tracking-tight">Linux Troubleshooting</h2>
        <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 flex gap-3 text-xs text-amber-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <span className="font-bold block mb-1">Wayland Clipboard Permission Warning</span>
            On Wayland sessions, certain flatpaks or sandboxed applications might block synthetic keyboard event insertion. If keyboard injection does not output text, review your active application policies or switch to X11-compatible keyboard fallback configurations in your config.
          </div>
        </div>
      </section>
    </div>
  );
}
