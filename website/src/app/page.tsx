"use client";

import { useState, useEffect } from 'react';
import { LogIn, UserPlus, Play, Sparkles, Menu, X, Check, Terminal, Shield, Zap, Keyboard, HelpCircle } from 'lucide-react';
import BoomerangVideoBg from '@/components/BoomerangVideoBg';

const BG_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_131941_d136af49-e243-493a-be14-6ff3f24e09e6.mp4';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'install' | 'wayland' | 'run'>('install');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const navLinks = [
    { href: '#why-us', label: 'Why WoiceFlow' },
    { href: '#features', label: 'Features' },
    { href: '#guide', label: 'Setup Guide' },
    { href: '#pricing', label: 'Compare' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#fcfdfc] text-[#1f2a1d]">
      {/* Hero Section Container */}
      <section className="relative w-full min-h-screen lg:h-screen overflow-hidden flex flex-col justify-between">
        <BoomerangVideoBg src={BG_VIDEO} className="absolute inset-0 w-full h-full" />
        
        {/* Navbar */}
        <nav className="relative z-30 flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 sm:py-6 bg-gradient-to-b from-white/40 to-transparent">
          <div className="flex items-center gap-2 text-[#2d3a2a]">
            <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">
              WoiceFlow<sup className="text-[10px] sm:text-xs font-semibold">TM</sup>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1 bg-white/70 backdrop-blur-md rounded-full pl-6 pr-1 py-1 shadow-sm border border-white/60">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm px-3 py-2 transition-colors ${
                  i === 0 ? 'font-semibold text-[#1f2a1d]' : 'font-medium text-[#4b5b47] hover:text-[#1f2a1d]'
                }`}
              >
                {link.label}
              </a>
            ))}
            <a href="#guide" className="ml-2 bg-[#1f2a1d] hover:bg-[#2a3827] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors">
              Install Guide
            </a>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 text-[#2d3a2a]">
            <a href="#github" className="hidden sm:flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity">
              <UserPlus className="w-4 h-4" />
              GitHub Repo
            </a>
            <a href="#guide" className="hidden sm:flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity">
              <LogIn className="w-4 h-4" />
              Get Started
            </a>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden relative flex items-center justify-center w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/60 text-[#1f2a1d] transition-all duration-300 hover:bg-white/90"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <Menu
                className={`w-5 h-5 absolute transition-all duration-300 ${
                  menuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
                }`}
              />
              <X
                className={`w-5 h-5 absolute transition-all duration-300 ${
                  menuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
                }`}
              />
            </button>
          </div>
        </nav>

        {/* Mobile menu overlay */}
        <div
          className={`lg:hidden fixed inset-0 z-20 transition-opacity duration-300 ${
            menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-[#1f2a1d]/40 backdrop-blur-sm" />
        </div>

        {/* Mobile menu drawer */}
        <div
          className={`lg:hidden fixed top-0 right-0 bottom-0 z-20 w-[85%] max-w-sm bg-white/95 backdrop-blur-xl shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full pt-24 px-8 pb-8">
            <div className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-2xl font-semibold text-[#1f2a1d] py-4 border-b border-[#1f2a1d]/10 transition-all duration-500 ${
                    menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                  }`}
                  style={{ transitionDelay: menuOpen ? `${150 + i * 70}ms` : '0ms' }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div
              className={`mt-8 flex flex-col gap-4 transition-all duration-500 ${
                menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
              }`}
              style={{ transitionDelay: menuOpen ? '400ms' : '0ms' }}
            >
              <a href="#github" className="flex items-center gap-2 text-sm font-medium text-[#2d3a2a] sm:hidden">
                <UserPlus className="w-4 h-4" />
                GitHub Repo
              </a>
              <a href="#guide" className="flex items-center gap-2 text-sm font-medium text-[#2d3a2a] sm:hidden">
                <LogIn className="w-4 h-4" />
                Get Started
              </a>
              <a href="#guide" onClick={() => setMenuOpen(false)} className="mt-2 bg-[#1f2a1d] hover:bg-[#2a3827] text-white text-center text-sm font-semibold px-5 py-3 rounded-full transition-colors">
                Install Guide
              </a>
            </div>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 flex flex-col items-center text-center pt-16 sm:pt-20 md:pt-24 px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#336443]/10 border border-[#336443]/20 mb-6 transition-all hover:bg-[#336443]/20">
            <Sparkles className="w-4 h-4 text-[#336443]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#336443]">4x Prompting & Coding Speed</span>
          </div>
          
          <h1
            className="font-normal leading-[0.95] text-[#336443] text-[2rem] sm:text-4xl md:text-5xl lg:text-[4.75rem] xl:text-[5.25rem] max-w-5xl"
            style={{ fontFamily: '"Neue Haas Grotesk Display Pro 55 Roman", "Neue Haas Grotesk Text Pro", "Helvetica Neue", Helvetica, Arial, sans-serif', letterSpacing: '-0.035em' }}
          >
            Close the rift{' '}
            <span className="text-[#85AB8B]">
              linking
              <br className="hidden sm:block" /> voice and action
            </span>
          </h1>
          <p className="mt-6 sm:mt-8 text-[#4b5b47] text-sm sm:text-base md:text-lg leading-relaxed max-w-xl px-2">
            Shape spoken thoughts into system-wide code and inputs instantly. WoiceFlow captures, transcribes offline using Whisper, and types into any Linux app at zero-latency.
          </p>
        </div>

        {/* Bottom Panel */}
        <div className="relative z-10 w-full px-4 sm:px-6 md:px-10 pb-10 pt-20 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 bg-gradient-to-t from-white/30 to-transparent">
          {/* Bottom-left CTA block */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2 text-[#3d5638] mb-3">
              <span className="text-sm font-semibold tracking-wide uppercase">
                WoiceFlow DictationHUD<sup className="text-[10px]">TM</sup>
              </span>
            </div>
            <p className="text-[#3d5638]/90 text-xs leading-relaxed mb-6 max-w-xs font-medium">
              LinkFlow smoothly unites local Whisper engines with standard Wayland interfaces, allowing seamless transcription directly into Firefox, Gedit, Discord, or your terminal.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <a href="#guide" className="bg-[#3d5638] hover:bg-[#2d4228] text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors shadow-sm">
                Get Started
              </a>
              <a href="#why-us" className="text-[#3d5638] text-sm font-semibold hover:opacity-80 transition-opacity">
                Why Offline?
              </a>
            </div>
          </div>

          {/* Bottom-right video link */}
          <div className="flex items-center gap-2 text-[#3d5638] text-sm">
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-[#3d5638]/10 hover:bg-[#3d5638]/20 transition-colors">
              <Play className="w-3.5 h-3.5 fill-[#3d5638] text-[#3d5638] ml-0.5" />
            </button>
            <span className="font-semibold">Local Offline Dictation</span>
            <span className="opacity-70">16kHz</span>
          </div>
        </div>
      </section>

      {/* Section 2: Why WoiceFlow? */}
      <section id="why-us" className="py-20 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto border-t border-[#336443]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#336443] tracking-tight leading-tight">
              A smarter way to write code & prompts.
            </h2>
            <p className="mt-6 text-[#4b5b47] leading-relaxed">
              Traditional dictation tools route your voice through cloud APIs, adding latency, subscription constraints, and security issues.
            </p>
            <p className="mt-4 text-[#4b5b47] leading-relaxed">
              WoiceFlow runs <strong>100% locally</strong> on your CPU. It transcribes audio in milliseconds using Faster-Whisper, and types it directly into your focused application using Linux system layers.
            </p>
          </div>
          
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#336443]/5 border border-[#336443]/10 p-6 rounded-2xl">
              <Shield className="w-8 h-8 text-[#336443] mb-4" />
              <h3 className="text-lg font-bold text-[#1f2a1d]">100% Secure & Private</h3>
              <p className="mt-2 text-sm text-[#4b5b47]">
                Your speech never leaves your machine. No cloud logs, no API telemetry, and absolute privacy for your proprietary code and communications.
              </p>
            </div>

            <div className="bg-[#336443]/5 border border-[#336443]/10 p-6 rounded-2xl">
              <Zap className="w-8 h-8 text-[#336443] mb-4" />
              <h3 className="text-lg font-bold text-[#1f2a1d]">Supercharged Speed</h3>
              <p className="mt-2 text-sm text-[#4b5b47]">
                Dictate complex blocks of text or prompt messages up to 4x faster than typing. Instantly trigger, speak, and type seamlessly.
              </p>
            </div>

            <div className="bg-[#336443]/5 border border-[#336443]/10 p-6 rounded-2xl">
              <Keyboard className="w-8 h-8 text-[#336443] mb-4" />
              <h3 className="text-lg font-bold text-[#1f2a1d]">Fedora Wayland Native</h3>
              <p className="mt-2 text-sm text-[#4b5b47]">
                Wayland blocks traditional global keyloggers and input triggers. Our custom Unix IPC bridge bypasses Wayland restrictions cleanly and securely.
              </p>
            </div>

            <div className="bg-[#336443]/5 border border-[#336443]/10 p-6 rounded-2xl">
              <Terminal className="w-8 h-8 text-[#336443] mb-4" />
              <h3 className="text-lg font-bold text-[#1f2a1d]">Active HUD Overlay</h3>
              <p className="mt-2 text-sm text-[#4b5b47]">
                Get instant visual feedback with a glassmorphic floating HUD overlay showing recording states, loading animations, and transcribed snippets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Features Grid */}
      <section id="features" className="bg-[#336443]/5 py-20 sm:py-28 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#336443] tracking-tight">
              Engineered for productivity
            </h2>
            <p className="mt-4 text-[#4b5b47] leading-relaxed">
              Every detail is optimized to provide an instant, seamless keyboard replacement experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-[#336443]/10 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#336443] tracking-wider uppercase bg-[#336443]/10 px-3 py-1 rounded-full">Speech Model</span>
                <h3 className="text-xl font-bold mt-4 text-[#1f2a1d]">Faster-Whisper CPU</h3>
                <p className="mt-3 text-sm text-[#4b5b47] leading-relaxed">
                  Leverages the high-performance C++ implementation of Whisper, quantized to int8 for extremely low memory usage and high-speed CPU inference.
                </p>
              </div>
              <div className="mt-6 border-t border-[#336443]/10 pt-4 text-xs font-medium text-[#4b5b47]">
                Quantization: int8 | Dev: C++
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#336443]/10 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#336443] tracking-wider uppercase bg-[#336443]/10 px-3 py-1 rounded-full">Injection</span>
                <h3 className="text-xl font-bold mt-4 text-[#1f2a1d]">Self-Healing ydotool</h3>
                <p className="mt-3 text-sm text-[#4b5b47] leading-relaxed">
                  Automatically manages the background virtual input daemon (`ydotoold`), cleaning up lockfiles, and starting it automatically on launch.
                </p>
              </div>
              <div className="mt-6 border-t border-[#336443]/10 pt-4 text-xs font-medium text-[#4b5b47]">
                Virtual keyboard injection layer
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#336443]/10 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#336443] tracking-wider uppercase bg-[#336443]/10 px-3 py-1 rounded-full">UI/UX</span>
                <h3 className="text-xl font-bold mt-4 text-[#1f2a1d]">Dictation HUD Overlay</h3>
                <p className="mt-3 text-sm text-[#4b5b47] leading-relaxed">
                  A beautiful, translucent overlay that pulses depending on states and fades out instantly when typing is completed.
                </p>
              </div>
              <div className="mt-6 border-t border-[#336443]/10 pt-4 text-xs font-medium text-[#4b5b47]">
                PyQt6 | Glassmorphism styling
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Installation & Guidance */}
      <section id="guide" className="py-20 sm:py-28 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-normal text-[#336443] tracking-tight">
            Install and run in minutes
          </h2>
          <p className="mt-3 text-[#4b5b47]">
            Set up WoiceFlow locally on your Fedora Linux desktop.
          </p>
        </div>

        {/* Custom Tab component */}
        <div className="bg-white border border-[#336443]/10 rounded-3xl overflow-hidden shadow-sm">
          <div className="flex border-b border-[#336443]/10 bg-[#336443]/5 p-2 gap-2">
            <button
              onClick={() => setActiveTab('install')}
              className={`flex-1 py-3 px-4 text-sm font-semibold rounded-2xl transition-all ${
                activeTab === 'install' ? 'bg-[#336443] text-white shadow-sm' : 'text-[#4b5b47] hover:bg-[#336443]/10'
              }`}
            >
              1. Clone & Set Up
            </button>
            <button
              onClick={() => setActiveTab('wayland')}
              className={`flex-1 py-3 px-4 text-sm font-semibold rounded-2xl transition-all ${
                activeTab === 'wayland' ? 'bg-[#336443] text-white shadow-sm' : 'text-[#4b5b47] hover:bg-[#336443]/10'
              }`}
            >
              2. Wayland Hotkey
            </button>
            <button
              onClick={() => setActiveTab('run')}
              className={`flex-1 py-3 px-4 text-sm font-semibold rounded-2xl transition-all ${
                activeTab === 'run' ? 'bg-[#336443] text-white shadow-sm' : 'text-[#4b5b47] hover:bg-[#336443]/10'
              }`}
            >
              3. Run dictation
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'install' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1f2a1d]">Create Virtual Environment & Install</h3>
                  <p className="text-sm text-[#4b5b47] mt-1">
                    Clone the project and build the Python virtual environment with dependencies automatically.
                  </p>
                </div>
                
                <div className="relative bg-[#1f2a1d] text-white p-4 rounded-xl font-mono text-xs sm:text-sm overflow-x-auto">
                  <span className="text-white/40"># Clone the repository and install</span>
                  <br />
                  git clone https://github.com/NoahMenezes/WoiceFlow.git
                  <br />
                  cd WoiceFlow
                  <br />
                  python -m venv .venv
                  <br />
                  source .venv/bin/activate
                  <br />
                  pip install -e .
                  
                  <button
                    onClick={() => copyToClipboard('git clone https://github.com/NoahMenezes/WoiceFlow.git && cd WoiceFlow && python -m venv .venv && source .venv/bin/activate && pip install -e .', 'setup')}
                    className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-xs transition-colors"
                  >
                    {copiedText === 'setup' ? 'Copied! ✓' : 'Copy'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'wayland' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1f2a1d]">Configure Fedora/GNOME Shortcuts</h3>
                  <p className="text-sm text-[#4b5b47] mt-1">
                    Due to Wayland restrictions, we register a custom shortcut to handle key presses securely.
                  </p>
                </div>
                
                <ol className="list-decimal pl-5 space-y-2 text-sm text-[#4b5b47]">
                  <li>Open Fedora **Settings** and navigate to **Keyboard** ➔ **Keyboard Shortcuts** ➔ **View and Customize Shortcuts**.</li>
                  <li>Scroll to the bottom, click **Custom Shortcuts**, and press **Add Shortcut (+)**.</li>
                  <li>Set the Name to **`WoiceFlow Toggle`**.</li>
                  <li>Set the Command field to the absolute path of the trigger client:
                    <div className="my-2 bg-[#1f2a1d]/5 p-3 rounded-lg font-mono text-xs text-[#1f2a1d] border border-[#336443]/10 break-all select-all">
                      /home/noah/Desktop/Python/WoiceFlow/.venv/bin/python /home/noah/Desktop/Python/WoiceFlow/src/woiceflow/hotkeys/toggle.py
                    </div>
                  </li>
                  <li>Set the Shortcut key to **`F9`** and click **Add**.</li>
                </ol>
              </div>
            )}

            {activeTab === 'run' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1f2a1d]">Start dictating in any application</h3>
                  <p className="text-sm text-[#4b5b47] mt-1">
                    With the keyboard shortcut bound, you can trigger voice dictation instantly.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border border-[#336443]/10 p-4 rounded-xl bg-[#336443]/5">
                    <span className="text-xs font-bold text-[#336443]">STEP 1</span>
                    <h4 className="font-bold text-[#1f2a1d] mt-1">Start Daemon</h4>
                    <p className="text-xs text-[#4b5b47] mt-1">Run `python main.py` in your terminal to keep the background pipeline active.</p>
                  </div>
                  <div className="border border-[#336443]/10 p-4 rounded-xl bg-[#336443]/5">
                    <span className="text-xs font-bold text-[#336443]">STEP 2</span>
                    <h4 className="font-bold text-[#1f2a1d] mt-1">Press F9 & Speak</h4>
                    <p className="text-xs text-[#4b5b47] mt-1">Focus cursor in Firefox or terminal, press F9, dictate, and press F9 again to finish.</p>
                  </div>
                  <div className="border border-[#336443]/10 p-4 rounded-xl bg-[#336443]/5">
                    <span className="text-xs font-bold text-[#336443]">STEP 3</span>
                    <h4 className="font-bold text-[#1f2a1d] mt-1">Auto Injection</h4>
                    <p className="text-xs text-[#4b5b47] mt-1">The HUD will show your transcription, and then `ydotool` types it instantly at your cursor.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 5: Comparison Tariff Table */}
      <section id="pricing" className="bg-[#336443]/5 py-20 sm:py-28 px-4 sm:px-8 border-t border-[#336443]/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-normal text-[#336443] tracking-tight">
              Compare WoiceFlow
            </h2>
            <p className="mt-3 text-[#4b5b47]">
              Why local open-source outperforms proprietary cloud subscriptions.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#336443]/10 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#336443]/10 text-sm font-bold text-[#1f2a1d] border-b border-[#336443]/10">
                  <th className="p-4 sm:p-6">Feature</th>
                  <th className="p-4 sm:p-6">Cloud Subscriptions</th>
                  <th className="p-4 sm:p-6 text-[#336443] bg-[#336443]/5">WoiceFlow (Local)</th>
                </tr>
              </thead>
              <tbody className="text-sm text-[#4b5b47] divide-y divide-[#336443]/10">
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-[#1f2a1d]">Cost</td>
                  <td className="p-4 sm:p-6">$15 - $30 / month</td>
                  <td className="p-4 sm:p-6 text-emerald-700 bg-[#336443]/5 font-bold">100% Free / Open Source</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-[#1f2a1d]">Latency</td>
                  <td className="p-4 sm:p-6">1.5s - 3s (Network dependent)</td>
                  <td className="p-4 sm:p-6 text-emerald-700 bg-[#336443]/5 font-bold">Sub-second local CPU (int8)</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-[#1f2a1d]">Data Privacy</td>
                  <td className="p-4 sm:p-6">Cloud storage & API telemetry</td>
                  <td className="p-4 sm:p-6 text-emerald-700 bg-[#336443]/5 font-bold">100% Local (never leaves host)</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-[#1f2a1d]">Wayland Compatibility</td>
                  <td className="p-4 sm:p-6">Requires global X11 key grabbers</td>
                  <td className="p-4 sm:p-6 text-emerald-700 bg-[#336443]/5 font-bold">Native Unix IPC Bridge</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1f2a1d] text-white/70 py-12 px-4 sm:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white tracking-tight">WoiceFlow</span>
            <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-white/60">v1.0.0</span>
          </div>
          
          <div className="flex gap-6 text-sm">
            <a href="#why-us" className="hover:text-white transition-colors">Purpose</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#guide" className="hover:text-white transition-colors">Install</a>
          </div>

          <div className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} WoiceFlow. Built for the Fedora Linux community.
          </div>
        </div>
      </footer>
    </div>
  );
}
