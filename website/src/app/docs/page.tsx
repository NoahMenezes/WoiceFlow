import React from 'react';
import Link from 'next/link';
import { Cpu, Terminal, Shield, ArrowRight, Volume2, Key, Sparkles } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="space-y-10 max-w-4xl">
      <div className="space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Introduction</h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          Welcome to the official WoiceFlow documentation. WoiceFlow is an ultra-fast, local, offline voice dictation overlay designed to boost your text input speeds to 20x keyboard emulation limits.
        </p>
      </div>

      {/* Grid of features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#85AB8B]/10 flex items-center justify-center">
            <Volume2 className="w-5 h-5 text-[#85AB8B]" />
          </div>
          <h3 className="text-lg font-bold text-white">Faster-Whisper</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Uses highly optimized C++ ports of OpenAI&apos;s Whisper engine, reducing hardware memory footprints by up to 4x and speeding up transcription rates.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#85AB8B]/10 flex items-center justify-center">
            <Key className="w-5 h-5 text-[#85AB8B]" />
          </div>
          <h3 className="text-lg font-bold text-white">Global hotkey binding</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Activated system-wide using the <kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-xs">F9</kbd> key. Holds to record, releases to transcribe and inject directly at the cursor.
          </p>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white tracking-tight">Select your platform to begin setup</h2>
        <p className="text-slate-400 text-sm">
          Select the operating system you are running to access targeted setup scripts, daemon loaders, and hardware virtualization guides, or check out our premium custom UI components.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Link href="/docs/linux" className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-[#85AB8B]/5 hover:border-[#85AB8B]/30 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Cpu className="w-5 h-5 text-[#85AB8B]" />
                <span className="font-bold text-white">Linux Docs</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform ml-auto" />
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Fedora Gnome, Wayland integration, and desktop launchers setup.
              </p>
            </div>
          </Link>

          <Link href="/docs/windows" className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-[#85AB8B]/5 hover:border-[#85AB8B]/30 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-[#85AB8B]" />
                <span className="font-bold text-white">Windows Docs</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform ml-auto" />
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                PyInstaller build scripts, Inno Setup executables, and Startup Registry entries.
              </p>
            </div>
          </Link>

          <Link href="/docs/macos" className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-[#85AB8B]/5 hover:border-[#85AB8B]/30 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#85AB8B]" />
                <span className="font-bold text-white">macOS Docs</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform ml-auto" />
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                LaunchAgents setup, sound card virtualization, and plist daemons.
              </p>
            </div>
          </Link>

          <Link href="/docs/components/siri-orb" className="p-6 rounded-2xl border border-[#85AB8B]/20 bg-white/[0.01] hover:bg-[#85AB8B]/5 hover:border-[#85AB8B]/40 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#85AB8B]" />
                <span className="font-bold text-white">Siri Orb</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform ml-auto" />
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Interactive playground, features, API props and accessibility documentation.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
