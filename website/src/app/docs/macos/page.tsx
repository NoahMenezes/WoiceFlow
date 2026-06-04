import React from 'react';
import { Shield, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';

export default function MacOSDocs() {
  return (
    <div className="space-y-10 max-w-4xl">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#85AB8B]/10 border border-[#85AB8B]/20">
          <Shield className="w-4 h-4 text-[#85AB8B]" />
          <span className="text-xs font-bold text-[#85AB8B] uppercase tracking-wider">macOS Daemon & Plist</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">macOS Installation</h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          WoiceFlow runs as a persistent background LaunchAgent plist service on macOS. This triggers automatic initialization when your user session loads and ensures the system remains alive in user-space.
        </p>
      </div>

      {/* Plist install block */}
      <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#85AB8B]" /> One-Command LaunchAgent Installer
        </h2>
        <p className="text-sm text-slate-300">
          Execute this setup script from your macOS terminal to deploy the service:
        </p>
        <div className="rounded-xl bg-black/60 border border-white/10 p-4 font-mono text-sm text-emerald-400 select-all overflow-x-auto">
          curl -sSL https://raw.githubusercontent.com/NoahMenezes/WoiceFlow/main/install_macos.sh | bash
        </div>
      </div>

      {/* Daemon Structure */}
      <div className="space-y-6 pt-6 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white tracking-tight">Understanding launchd Daemon</h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          The installation registers a plist configuration under your local LaunchAgents folder `~/Library/LaunchAgents/com.woiceflow.app.plist`. This plist configures the execution environment:
        </p>
        <div className="p-5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
          &lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;<br />
          &lt;!DOCTYPE plist PUBLIC &quot;-//Apple//DTD PLIST 1.0//EN&quot; &quot;http://www.apple.com/DTDs/PropertyList-1.0.dtd&quot;&gt;<br />
          &lt;plist version=&quot;1.0&quot;&gt;<br />
          &lt;dict&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;key&gt;Label&lt;/key&gt;&lt;string&gt;com.woiceflow.app&lt;/string&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;key&gt;ProgramArguments&lt;/key&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;array&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;string&gt;/Users/YOUR_USER/.woiceflow/env/bin/python3&lt;/string&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;string&gt;/Users/YOUR_USER/.woiceflow/src/main.py&lt;/string&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;/array&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;key&gt;RunAtLoad&lt;/key&gt;&lt;true/&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;key&gt;KeepAlive&lt;/key&gt;&lt;true/&gt;<br />
          &lt;/dict&gt;<br />
          &lt;/plist&gt;
        </div>
      </div>

      {/* macOS Security Restrictions */}
      <div className="space-y-6 pt-6 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white tracking-tight">Crucial: Grant Accessibility & Microphone Permissions</h2>
        <div className="space-y-4">
          <p className="text-slate-300 text-sm leading-relaxed">
            Due to macOS sandboxing and security regulations, synthetic keyboard inputs are blocked unless the parent application has been granted system accessibility permission.
          </p>
          <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 flex gap-3 text-xs text-amber-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <span className="font-bold block mb-1">Grant Accessibility Rights</span>
              1. Open **System Settings**.<br />
              2. Go to **Privacy & Security** &rarr; **Accessibility**.<br />
              3. Enable **Terminal** (or whatever terminal wrapper you are executing from). If running compiled binary, add **WoiceFlow** to the allowed lists.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
