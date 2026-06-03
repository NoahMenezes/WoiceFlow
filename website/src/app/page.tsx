"use client";

import { useState, useEffect } from 'react';
import { UserPlus, Play, Sparkles, Menu, X, Check, Terminal, Shield, Zap, Keyboard, HelpCircle, ArrowRight, BookOpen, Layers, Award, MessageSquare } from 'lucide-react';
import BoomerangVideoBg from '@/components/BoomerangVideoBg';

const BG_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_131941_d136af49-e243-493a-be14-6ff3f24e09e6.mp4';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'install' | 'wayland' | 'run' | 'config'>('install');
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
    { href: '#why-us', label: 'The Core Technology' },
    { href: '#timeline', label: 'How It Works' },
    { href: '#feature-tree', label: 'Architecture Map' },
    { href: '#comparisons', label: 'Product Comparison' },
    { href: '#guide', label: 'Technical Guide' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#fcfdfc] text-[#1f2a1d] scroll-smooth">
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
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm px-3 py-2 font-medium text-[#4b5b47] hover:text-[#1f2a1d] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <a href="#guide" className="ml-2 bg-[#1f2a1d] hover:bg-[#2a3827] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-200 hover:scale-[1.02] inline-flex items-center gap-1">
              Install Guide <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 text-[#2d3a2a]">
            <a href="https://github.com/NoahMenezes/WoiceFlow" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity">
              <UserPlus className="w-4 h-4" />
              GitHub Repo
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
              <a href="https://github.com/NoahMenezes/WoiceFlow" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-[#2d3a2a]">
                <UserPlus className="w-4 h-4" />
                GitHub Repo
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
            className="font-normal leading-[0.95] text-[#336443] text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.75rem] xl:text-[5.5rem] max-w-5xl"
            style={{ fontFamily: '"Neue Haas Grotesk Display Pro 55 Roman", "Neue Haas Grotesk Text Pro", "Helvetica Neue", Helvetica, Arial, sans-serif', letterSpacing: '-0.035em' }}
          >
            Close the rift{' '}
            <span className="text-[#85AB8B]">
              linking
              <br className="hidden sm:block" /> voice and action
            </span>
          </h1>
          <p className="mt-6 sm:mt-8 text-[#4b5b47] text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl px-2">
            Shape spoken thoughts into system-wide code and inputs instantly. WoiceFlow captures, transcribes offline using Whisper, and injects text into any Linux application at **20x keyboard emulation speed**.
          </p>
        </div>

        {/* Bottom Panel */}
        <div className="relative z-10 w-full px-4 sm:px-6 md:px-10 pb-10 pt-20 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 bg-gradient-to-t from-white/30 to-transparent">
          {/* Bottom-left CTA block */}
          <div className="max-w-md">
            <div className="flex items-center gap-2 text-[#3d5638] mb-3">
              <span className="text-sm font-semibold tracking-wide uppercase">
                WoiceFlow DictationHUD<sup className="text-[10px]">TM</sup>
              </span>
            </div>
            <p className="text-[#3d5638]/90 text-xs leading-relaxed mb-6 max-w-sm font-medium">
              A glassmorphic overlay for Fedora GNOME Wayland. It bridges the gap between hardware microphones and local AI pipelines, typing straight into your active application.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <a href="#guide" className="bg-[#3d5638] hover:bg-[#2d4228] text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors shadow-sm inline-flex items-center gap-1">
                Get Started <ArrowRight className="w-3.5 h-3.5" />
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

      {/* Section 2: Why WoiceFlow & Core Tech */}
      <section id="why-us" className="py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto border-t border-[#336443]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#85AB8B] bg-[#85AB8B]/10 px-3 py-1 rounded-full">Core Philosophy</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#336443] tracking-tight leading-tight mt-6">
              Zero Latency. Local Execution. Wayland Native.
            </h2>
            <p className="mt-6 text-[#4b5b47] leading-relaxed">
              Proprietary voice systems query distant cloud clusters, introducing connection delays and privacy hazards.
            </p>
            <p className="mt-4 text-[#4b5b47] leading-relaxed">
              WoiceFlow runs **100% on device**. It couples the low-footprint **Faster-Whisper** execution model with an automated keyboard virtualizer, bypassing Linux system-level application sandboxing cleanly.
            </p>
            
            <div className="mt-8 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#336443]/10 flex items-center justify-center text-[#336443] mt-1">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1f2a1d] text-sm">20x Faster Typing Emulation</h4>
                  <p className="text-xs text-[#4b5b47]">Key delays are cut to 2ms, writing complete paragraphs in a split second.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#336443]/10 flex items-center justify-center text-[#336443] mt-1">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1f2a1d] text-sm">Technical Dictionary Alignment</h4>
                  <p className="text-xs text-[#4b5b47]">Whisper is prompted with code terms to prevent orthographic errors.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-[#336443]/10 p-8 rounded-3xl shadow-sm hover:border-[#85AB8B] transition-all duration-300">
              <Shield className="w-10 h-10 text-[#336443] mb-6" />
              <h3 className="text-xl font-bold text-[#1f2a1d]">100% Secure & Private</h3>
              <p className="mt-2 text-sm text-[#4b5b47] leading-relaxed">
                Your audio recording never leaves your computer. Absolute protection for confidential source code, corporate communications, and proprietary notes.
              </p>
            </div>

            <div className="bg-white border border-[#336443]/10 p-8 rounded-3xl shadow-sm hover:border-[#85AB8B] transition-all duration-300">
              <Zap className="w-10 h-10 text-[#336443] mb-6" />
              <h3 className="text-xl font-bold text-[#1f2a1d]">Local Prompt Boosting</h3>
              <p className="mt-2 text-sm text-[#4b5b47] leading-relaxed">
                Speed up your prompting workflow up to 4x. Talk directly to LLM chats, editors, or your terminal without taking your hands off the keys.
              </p>
            </div>

            <div className="bg-white border border-[#336443]/10 p-8 rounded-3xl shadow-sm hover:border-[#85AB8B] transition-all duration-300">
              <Keyboard className="w-10 h-10 text-[#336443] mb-6" />
              <h3 className="text-xl font-bold text-[#1f2a1d]">GNOME/Wayland Support</h3>
              <p className="mt-2 text-sm text-[#4b5b47] leading-relaxed">
                Wayland isolates input events, breaking classic key loggers. WoiceFlow bridges this through a client-server socket design.
              </p>
            </div>

            <div className="bg-white border border-[#336443]/10 p-8 rounded-3xl shadow-sm hover:border-[#85AB8B] transition-all duration-300">
              <Terminal className="w-10 h-10 text-[#336443] mb-6" />
              <h3 className="text-xl font-bold text-[#1f2a1d]">Self-Healing Stack</h3>
              <p className="mt-2 text-sm text-[#4b5b47] leading-relaxed">
                The text injection layer handles background processes automatically, cleaning up stale sockets and ensuring ydotool is ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Interactive System Architecture (The Working Solution) */}
      <section id="working" className="bg-white py-24 sm:py-32 px-4 sm:px-8 border-t border-[#336443]/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#336443] bg-[#336443]/10 px-3 py-1 rounded-full inline-flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> Core Working Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#336443] tracking-tight leading-tight">
                How It Works: Bidirectional IPC & State Control
              </h2>
              <p className="text-[#4b5b47] leading-relaxed">
                WoiceFlow operates on a split-architecture design that ensures maximum UI responsiveness and computational speed. Rather than bundling UI rendering and neural computation into a single heavy process, the application breaks these workflows down.
              </p>
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-[#336443]/5 border border-[#336443]/10">
                  <h4 className="font-bold text-[#1f2a1d] text-sm">Background Audio Daemon</h4>
                  <p className="text-xs text-[#4b5b47] mt-1">Runs a local multi-threaded loop. Captures raw sound frames, computes instant amplitude peaks, and hosts a local socket interface.</p>
                </div>
                <div className="p-5 rounded-2xl bg-[#336443]/5 border border-[#336443]/10">
                  <h4 className="font-bold text-[#1f2a1d] text-sm">Asynchronous IPC Channel</h4>
                  <p className="text-xs text-[#4b5b47] mt-1">Shares telemetry data (such as active state and amplitude sound peaks) between backend and frontend over UNIX domain sockets with auto-reconnection.</p>
                </div>
                <div className="p-5 rounded-2xl bg-[#336443]/5 border border-[#336443]/10">
                  <h4 className="font-bold text-[#1f2a1d] text-sm">Focus-Independent HUD</h4>
                  <p className="text-xs text-[#4b5b47] mt-1">Launches as a frameless, transparent overlay using native window-manager logic. It displays visual waveforms without taking active keyboard focus, keeping your typing cursor where it belongs.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-gradient-to-tr from-[#336443]/10 to-[#85AB8B]/10 p-8 sm:p-12 rounded-3xl border border-[#336443]/20 shadow-sm relative overflow-hidden flex flex-col justify-center">
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#336443] flex items-center justify-center text-white font-bold text-sm">UI</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-[#1f2a1d]">Flutter HUD Frontend</div>
                    <p className="text-[11px] text-[#4b5b47]">Displays glassmorphic waveform panel and processes key events</p>
                  </div>
                </div>
                <div className="flex justify-center my-1">
                  <div className="w-0.5 h-10 bg-gradient-to-b from-[#336443] to-[#85AB8B] border-dashed border-r"></div>
                </div>
                <div className="flex items-center gap-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#85AB8B] flex items-center justify-center text-white font-bold text-xs">IPC</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-[#1f2a1d]">UNIX Domain Socket / Loopback TCP</div>
                    <p className="text-[11px] text-[#4b5b47]">Bidirectional JSON pipelines streaming amplitude telemetry and state flags</p>
                  </div>
                </div>
                <div className="flex justify-center my-1">
                  <div className="w-0.5 h-10 bg-gradient-to-b from-[#85AB8B] to-[#3d5638] border-dashed border-r"></div>
                </div>
                <div className="flex items-center gap-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#3d5638] flex items-center justify-center text-white font-bold text-xs">PY</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-[#1f2a1d]">Python Transcription Core</div>
                    <p className="text-[11px] text-[#4b5b47]">Faster-Whisper offline model transcribing raw WAV buffers into string lines</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Timeline Animation (Step-by-Step Lifecycle) */}
      <section id="timeline" className="py-24 sm:py-32 px-4 sm:px-8 bg-[#336443]/5 border-t border-[#336443]/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-bold uppercase tracking-wider text-[#336443] bg-[#336443]/10 px-3 py-1 rounded-full">Execution Workflow</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#336443] tracking-tight mt-6">
              Lifecycle of a Spoken Input
            </h2>
            <p className="mt-4 text-[#4b5b47] leading-relaxed">
              When you press the hotkey, the entire stack shifts states instantly. Here is the lifecycle timeline of a single request.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Center line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#336443] via-[#85AB8B] to-[#336443]/10 hidden md:block"></div>

            {/* Step 1 */}
            <div className="relative flex flex-col md:flex-row items-stretch gap-8 mb-16">
              <div className="w-full md:w-1/2 text-left md:text-right pr-0 md:pr-12 flex flex-col justify-center">
                <div className="inline-block bg-[#336443]/10 text-[#336443] text-[10px] font-extrabold px-3 py-1 rounded-full mb-3 self-start md:self-end">STEP 1</div>
                <h3 className="text-xl font-bold text-[#1f2a1d]">Global Hotkey Captured</h3>
                <p className="mt-2 text-sm text-[#4b5b47] leading-relaxed">
                  The keyboard manager catches a shortcut toggle. This signal passes to the background socket handler, turning on the microphone capture stream.
                </p>
              </div>
              <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-[#336443] border-4 border-white shadow-sm flex items-center justify-center text-white text-[10px] font-bold z-10 hidden md:flex">1</div>
              <div className="w-full md:w-1/2"></div>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col md:flex-row-reverse items-stretch gap-8 mb-16">
              <div className="w-full md:w-1/2 text-left pl-0 md:pl-12 flex flex-col justify-center">
                <div className="inline-block bg-[#85AB8B]/10 text-[#85AB8B] text-[10px] font-extrabold px-3 py-1 rounded-full mb-3 self-start">STEP 2</div>
                <h3 className="text-xl font-bold text-[#1f2a1d]">HUD Displayed with Waveform</h3>
                <p className="mt-2 text-sm text-[#4b5b47] leading-relaxed">
                  The Python daemon pushes a state event to the frontend socket. The Flutter overlay displays in the bottom-center of the screen, rendering a custom mirrored audio waveform using peak amplitude measurements.
                </p>
              </div>
              <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-[#85AB8B] border-4 border-white shadow-sm flex items-center justify-center text-white text-[10px] font-bold z-10 hidden md:flex">2</div>
              <div className="w-full md:w-1/2"></div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col md:flex-row items-stretch gap-8 mb-16">
              <div className="w-full md:w-1/2 text-left md:text-right pr-0 md:pr-12 flex flex-col justify-center">
                <div className="inline-block bg-[#3d5638]/10 text-[#3d5638] text-[10px] font-extrabold px-3 py-1 rounded-full mb-3 self-start md:self-end">STEP 3</div>
                <h3 className="text-xl font-bold text-[#1f2a1d]">Offline Whisper Processing</h3>
                <p className="mt-2 text-sm text-[#4b5b47] leading-relaxed">
                  Toggling the shortcut again stops microphone collection. The local engine feeds the raw audio buffer into the quantized model weights on the CPU, yielding an instant, context- boosted transcription line.
                </p>
              </div>
              <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-[#3d5638] border-4 border-white shadow-sm flex items-center justify-center text-white text-[10px] font-bold z-10 hidden md:flex">3</div>
              <div className="w-full md:w-1/2"></div>
            </div>

            {/* Step 4 */}
            <div className="relative flex flex-col md:flex-row-reverse items-stretch gap-8">
              <div className="w-full md:w-1/2 text-left pl-0 md:pl-12 flex flex-col justify-center">
                <div className="inline-block bg-[#1f2a1d]/10 text-[#1f2a1d] text-[10px] font-extrabold px-3 py-1 rounded-full mb-3 self-start">STEP 4</div>
                <h3 className="text-xl font-bold text-[#1f2a1d]">Keyboard Emulation Injection</h3>
                <p className="mt-2 text-sm text-[#4b5b47] leading-relaxed">
                  The transcription line writes directly to the active system window via standard virtual keyboard simulation. The HUD presents a final confirmation, and fades away automatically.
                </p>
              </div>
              <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-[#1f2a1d] border-4 border-white shadow-sm flex items-center justify-center text-white text-[10px] font-bold z-10 hidden md:flex">4</div>
              <div className="w-full md:w-1/2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Feature Tree & Modular Ideas */}
      <section id="feature-tree" className="py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto border-t border-[#336443]/10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-bold uppercase tracking-wider text-[#336443] bg-[#336443]/10 px-3 py-1 rounded-full inline-flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Architecture Topology
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#336443] tracking-tight mt-6">
            Feature & Idea Tree Map
          </h2>
          <p className="mt-4 text-[#4b5b47] leading-relaxed">
            WoiceFlow is organized into separate layers, separating raw audio capture, interface graphics, socket control, and keyboard automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Card 1 */}
          <div className="bg-[#336443]/5 border border-[#336443]/10 p-6 rounded-3xl relative">
            <div className="w-10 h-10 rounded-2xl bg-[#336443] text-white flex items-center justify-center font-bold mb-4">01</div>
            <h4 className="text-base font-bold text-[#1f2a1d] mb-3">Audio Capture Layer</h4>
            <ul className="space-y-2 text-xs text-[#4b5b47]">
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#336443]" /> Monophonic 16kHz conversion</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#336443]" /> Peak amplitude parser</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#336443]" /> Thread-safe sound queue</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-[#336443]/5 border border-[#336443]/10 p-6 rounded-3xl relative">
            <div className="w-10 h-10 rounded-2xl bg-[#85AB8B] text-white flex items-center justify-center font-bold mb-4">02</div>
            <h4 className="text-base font-bold text-[#1f2a1d] mb-3">IPC Gateway Layer</h4>
            <ul className="space-y-2 text-xs text-[#4b5b47]">
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#85AB8B]" /> UNIX Domain Sockets (Linux)</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#85AB8B]" /> TCP Loopback fallback</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#85AB8B]" /> JSON telemetry broadcaster</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-[#336443]/5 border border-[#336443]/10 p-6 rounded-3xl relative">
            <div className="w-10 h-10 rounded-2xl bg-[#3d5638] text-white flex items-center justify-center font-bold mb-4">03</div>
            <h4 className="text-base font-bold text-[#1f2a1d] mb-3">Neural Model Layer</h4>
            <ul className="space-y-2 text-xs text-[#4b5b47]">
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#3d5638]" /> Quantized Faster-Whisper</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#3d5638]" /> 86% memory footprint drop</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#3d5638]" /> Specialized coding dictionaries</li>
            </ul>
          </div>

          {/* Card 4 */}
          <div className="bg-[#336443]/5 border border-[#336443]/10 p-6 rounded-3xl relative">
            <div className="w-10 h-10 rounded-2xl bg-[#1f2a1d] text-white flex items-center justify-center font-bold mb-4">04</div>
            <h4 className="text-base font-bold text-[#1f2a1d] mb-3">GUI HUD Layer</h4>
            <ul className="space-y-2 text-xs text-[#4b5b47]">
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#1f2a1d]" /> Glassmorphic window</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#1f2a1d]" /> Non-focus stealing overlay</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#1f2a1d]" /> Dual-sided mirrored waveform</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 6: How Is It Different (Comparison Table) */}
      <section id="comparisons" className="bg-[#336443]/5 py-24 sm:py-32 px-4 sm:px-8 border-y border-[#336443]/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#336443] bg-[#336443]/10 px-3 py-1 rounded-full inline-flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Market Differentiation
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#336443] tracking-tight mt-6">
              How WoiceFlow Stands Out
            </h2>
            <p className="mt-4 text-[#4b5b47] leading-relaxed">
              We designed WoiceFlow specifically to bypass cloud lag, high subscription costs, and Wayland window-manager sandbox restrictions.
            </p>
          </div>

          <div className="overflow-x-auto bg-white border border-[#336443]/10 rounded-3xl shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#336443]/5 border-b border-[#336443]/10">
                  <th className="p-6 text-sm font-bold text-[#1f2a1d] w-1/4">Feature</th>
                  <th className="p-6 text-sm font-bold text-[#336443] w-1/4">WoiceFlow (Local)</th>
                  <th className="p-6 text-sm font-bold text-[#4b5b47] w-1/4">Wispr Flow (Cloud-first)</th>
                  <th className="p-6 text-sm font-bold text-[#4b5b47] w-1/4">Standard Cloud APIs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#336443]/10 text-sm">
                <tr>
                  <td className="p-6 font-bold text-[#1f2a1d]">Execution Target</td>
                  <td className="p-6 text-[#336443] font-medium flex items-center gap-1.5"><Check className="w-4 h-4" /> 100% Offline (Local CPU/GPU)</td>
                  <td className="p-6 text-[#4b5b47]">Cloud Servers (Proprietary)</td>
                  <td className="p-6 text-[#4b5b47]">Cloud Servers</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-[#1f2a1d]">Typical Latency</td>
                  <td className="p-6 text-[#336443] font-medium flex items-center gap-1.5"><Check className="w-4 h-4" /> ~200ms - 250ms</td>
                  <td className="p-6 text-[#4b5b47]">~600ms - 1,200ms (API lag)</td>
                  <td className="p-6 text-[#4b5b47]">1,500ms+ (Round-trip)</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-[#1f2a1d]">Privacy & Security</td>
                  <td className="p-6 text-[#336443] font-medium flex items-center gap-1.5"><Check className="w-4 h-4" /> Total (No remote queries)</td>
                  <td className="p-6 text-[#4b5b47]">Low (Sends voice packets)</td>
                  <td className="p-6 text-[#4b5b47]">Low (Monitored data collections)</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-[#1f2a1d]">Operating System Support</td>
                  <td className="p-6 text-[#336443] font-medium flex items-center gap-1.5"><Check className="w-4 h-4" /> Wayland, X11, Win, macOS</td>
                  <td className="p-6 text-[#4b5b47]">Mac & Windows Only</td>
                  <td className="p-6 text-[#4b5b47]">Generic system bindings only</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-[#1f2a1d]">Pricing Model</td>
                  <td className="p-6 text-[#336443] font-medium flex items-center gap-1.5"><Check className="w-4 h-4" /> Open-Source & Forever Free</td>
                  <td className="p-6 text-[#4b5b47]">Monthly subscription tier</td>
                  <td className="p-6 text-[#4b5b47]">Pay-per-token API usages</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 7: User Feedback & Mock Testimonials */}
      <section className="py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#336443] bg-[#336443]/10 px-3 py-1 rounded-full inline-flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" /> User Experience
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#336443] tracking-tight mt-6">
            Developer Feedbacks
          </h2>
          <p className="mt-4 text-[#4b5b47] leading-relaxed">
            See how developers are using offline dictation to change their coding and writing workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#336443]/5 border border-[#336443]/10 p-8 rounded-3xl">
            <p className="text-sm italic text-[#4b5b47] leading-relaxed">
              {"\"Running on Wayland (Fedora 43), most tools that try to simulate keys completely break. WoiceFlow works flawlessly because of its virtual keyboard virtualization. The injection is so fast I can write complex text structures in half a second.\""}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#336443] flex items-center justify-center text-white font-bold text-xs">M</div>
              <div>
                <h4 className="text-sm font-bold text-[#1f2a1d]">Marcus K.</h4>
                <p className="text-[11px] text-[#4b5b47]">Fedora Systems Engineer</p>
              </div>
            </div>
          </div>

          <div className="bg-[#336443]/5 border border-[#336443]/10 p-8 rounded-3xl">
            <p className="text-sm italic text-[#4b5b47] leading-relaxed">
              {"\"I dictate my programming logic prompts directly to LLM tools while coding. Standard dictation is sluggish, but WoiceFlow outputs words instantly without taking my hands off the home row. My workflow feels completely fluid now.\""}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#85AB8B] flex items-center justify-center text-white font-bold text-xs">E</div>
              <div>
                <h4 className="text-sm font-bold text-[#1f2a1d]">Elena R.</h4>
                <p className="text-[11px] text-[#4b5b47]">Senior Backend Architect</p>
              </div>
            </div>
          </div>

          <div className="bg-[#336443]/5 border border-[#336443]/10 p-8 rounded-3xl">
            <p className="text-sm italic text-[#4b5b47] leading-relaxed">
              {"\"The local quantization model is extremely efficient. The base engine only takes up around 74MB of memory when running, meaning my laptop can compile heavy code blocks without running out of memory.\""}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3d5638] flex items-center justify-center text-white font-bold text-xs">J</div>
              <div>
                <h4 className="text-sm font-bold text-[#1f2a1d]">Julian B.</h4>
                <p className="text-[11px] text-[#4b5b47]">ML Ops Engineer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Technical Guide & Setup Documentation */}
      <section id="guide" className="py-24 sm:py-32 px-4 sm:px-8 bg-[#336443]/5 border-t border-[#336443]/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#336443] bg-[#336443]/10 px-3 py-1 rounded-full">Documentation</span>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#336443] tracking-tight mt-6">
              Installation & Configuration Guide
            </h2>
            <p className="mt-3 text-[#4b5b47] max-w-2xl mx-auto">
              Follow these steps to get WoiceFlow fully integrated into your desktop environment.
            </p>
          </div>

          {/* Docs Tab Container */}
          <div className="bg-white border border-[#336443]/10 rounded-3xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#336443]/10 bg-[#336443]/5 p-2 gap-2">
              <button
                onClick={() => setActiveTab('install')}
                className={`py-3 px-4 text-xs sm:text-sm font-semibold rounded-2xl transition-all ${
                  activeTab === 'install' ? 'bg-[#336443] text-white shadow-sm' : 'text-[#4b5b47] hover:bg-[#336443]/10'
                }`}
              >
                1. Local Setup
              </button>
              <button
                onClick={() => setActiveTab('wayland')}
                className={`py-3 px-4 text-xs sm:text-sm font-semibold rounded-2xl transition-all ${
                  activeTab === 'wayland' ? 'bg-[#336443] text-white shadow-sm' : 'text-[#4b5b47] hover:bg-[#336443]/10'
                }`}
              >
                2. Keyboard Bind
              </button>
              <button
                onClick={() => setActiveTab('config')}
                className={`py-3 px-4 text-xs sm:text-sm font-semibold rounded-2xl transition-all ${
                  activeTab === 'config' ? 'bg-[#336443] text-white shadow-sm' : 'text-[#4b5b47] hover:bg-[#336443]/10'
                }`}
              >
                3. Environment vars
              </button>
              <button
                onClick={() => setActiveTab('run')}
                className={`py-3 px-4 text-xs sm:text-sm font-semibold rounded-2xl transition-all ${
                  activeTab === 'run' ? 'bg-[#336443] text-white shadow-sm' : 'text-[#4b5b47] hover:bg-[#336443]/10'
                }`}
              >
                4. Running Daemon
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {activeTab === 'install' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#1f2a1d]">Create Virtual Environment & Local Bindings</h3>
                    <p className="text-sm text-[#4b5b47] mt-1">
                      Set up dependencies. Running python packaging under an editable flag (`-e`) is recommended.
                    </p>
                  </div>
                  
                  <div className="relative bg-[#1f2a1d] text-white p-5 rounded-xl font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed">
                    <span className="text-white/40"># Clone project repository</span>
                    <br />
                    git clone https://github.com/NoahMenezes/WoiceFlow.git
                    <br />
                    cd WoiceFlow
                    <br />
                    <span className="text-white/40"># Create virtual environment</span>
                    <br />
                    python -m venv .venv
                    <br />
                    source .venv/bin/activate
                    <br />
                    <span className="text-white/40"># Install packages in editable development mode</span>
                    <br />
                    pip install -e .
                    
                    <button
                      onClick={() => copyToClipboard('git clone https://github.com/NoahMenezes/WoiceFlow.git && cd WoiceFlow && python -m venv .venv && source .venv/bin/activate && pip install -e .', 'setup')}
                      className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-xs transition-colors"
                    >
                      {copiedText === 'setup' ? 'Copied! ✓' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'wayland' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#1f2a1d]">Register GNOME Shortcuts</h3>
                    <p className="text-sm text-[#4b5b47] mt-1">
                      Standard key grabbers are blocked on Wayland desktop sessions. Binding `F9` to our client script passes input commands straight to the Unix socket listener.
                    </p>
                  </div>
                  
                  <ol className="list-decimal pl-5 space-y-3 text-sm text-[#4b5b47] leading-relaxed">
                    <li>Launch **Settings** on Fedora and click **Keyboard** ➔ **Keyboard Shortcuts** ➔ **View and Customize Shortcuts**.</li>
                    <li>Scroll down and click **Custom Shortcuts**, then click **Add Shortcut (+)**.</li>
                    <li>Enter Name: **`WoiceFlow Toggle`**.</li>
                    <li>Input the Command pointing to your local repository directory:
                      <div className="my-2 bg-[#1f2a1d]/5 p-3 rounded-lg font-mono text-xs text-[#1f2a1d] border border-[#336443]/10 break-all select-all select-none">
                        /home/noah/Desktop/Python/WoiceFlow/.venv/bin/python /home/noah/Desktop/Python/WoiceFlow/src/woiceflow/hotkeys/toggle.py
                      </div>
                    </li>
                    <li>Bind key to **`F9`** and click **Add**.</li>
                  </ol>
                </div>
              )}

              {activeTab === 'config' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#1f2a1d]">Configure environment variables</h3>
                    <p className="text-sm text-[#4b5b47] mt-1">
                      Create a `.env` file at the project root to tweak speed, models, and audio hardware.
                    </p>
                  </div>
                  
                  <div className="relative bg-[#1f2a1d] text-white p-5 rounded-xl font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed">
                    <span className="text-white/40"># Quantized model size: base, small, or medium</span>
                    <br />
                    WOICEFLOW_MODEL_SIZE=base
                    <br />
                    <span className="text-white/40"># Typing delay configuration (in milliseconds)</span>
                    <br />
                    WOICEFLOW_KEY_DELAY=2
                    <br />
                    WOICEFLOW_KEY_HOLD=1
                    <br />
                    <span className="text-white/40"># CPU or GPU execution target</span>
                    <br />
                    WOICEFLOW_DEVICE=cpu
                    
                    <button
                      onClick={() => copyToClipboard('WOICEFLOW_MODEL_SIZE=base\nWOICEFLOW_KEY_DELAY=2\nWOICEFLOW_KEY_HOLD=1\nWOICEFLOW_DEVICE=cpu', 'env')}
                      className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-xs transition-colors"
                    >
                      {copiedText === 'env' ? 'Copied! ✓' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'run' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#1f2a1d]">Running the daemon</h3>
                    <p className="text-sm text-[#4b5b47] mt-1">
                      Start the coordinator process to monitor socket operations and handle text rendering.
                    </p>
                  </div>

                  <div className="relative bg-[#1f2a1d] text-white p-5 rounded-xl font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed">
                    <span className="text-white/40"># Run the dictation server</span>
                    <br />
                    python main.py
                    
                    <button
                      onClick={() => copyToClipboard('python main.py', 'runcmd')}
                      className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-xs transition-colors"
                    >
                      {copiedText === 'runcmd' ? 'Copied! ✓' : 'Copy'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#4b5b47] leading-relaxed pt-4 border-t border-[#336443]/10">
                    <div>
                      <span className="font-bold text-[#1f2a1d] block">Microphone Capture</span>
                      A dynamic queue catches local stream packets, converting stereophonic signals into monophonic frames.
                    </div>
                    <div>
                      <span className="font-bold text-[#1f2a1d] block">Model Quantization</span>
                      Inference compiles with int8 layers to keep CPU load low.
                    </div>
                    <div>
                      <span className="font-bold text-[#1f2a1d] block">Typing Execution</span>
                      Types directly at your cursor. Emojis, markup code, and technical keywords paste immediately.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 9: FAQ Section */}
      <section id="faq" className="py-24 sm:py-32 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#85AB8B] bg-[#85AB8B]/10 px-3 py-1 rounded-full">Help & FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#336443] tracking-tight mt-6">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-[#4b5b47]">
            Answers to common questions about system setup and operations.
          </p>
        </div>

        <div className="space-y-8 divide-y divide-[#336443]/10">
          <div className="pt-8 first:pt-0">
            <h3 className="text-lg font-bold text-[#1f2a1d] flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#336443]" />
              Why is typing slow in some terminals?
            </h3>
            <p className="mt-3 text-sm text-[#4b5b47] leading-relaxed">
              If typing lags, keyboard delay parameters may be set too high. Check your environment configuration and reduce the key delay and hold settings inside your configuration file to match your hardware limits.
            </p>
          </div>

          <div className="pt-8">
            <h3 className="text-lg font-bold text-[#1f2a1d] flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#336443]" />
              Does it require a GPU?
            </h3>
            <p className="mt-3 text-sm text-[#4b5b47] leading-relaxed">
              No. WoiceFlow is built to run on standard CPUs. The quantized model weights reduce memory footprint and latency, allowing base models to run in under 200ms on most processors.
            </p>
          </div>

          <div className="pt-8">
            <h3 className="text-lg font-bold text-[#1f2a1d] flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#336443]" />
              What are the prerequisites for keyboard virtualization on Fedora?
            </h3>
            <p className="mt-3 text-sm text-[#4b5b47] leading-relaxed">
              You must have the virtualization driver and keyboard daemon active. Additionally, ensure your system user has permissions to write to virtual input devices to execute inputs.
            </p>
          </div>

          <div className="pt-8">
            <h3 className="text-lg font-bold text-[#1f2a1d] flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#336443]" />
              How do I use more accurate Whisper models?
            </h3>
            <p className="mt-3 text-sm text-[#4b5b47] leading-relaxed">
              You can upgrade the speech model by editing the environment config size setting to small or medium. Higher-parameter models improve accuracy for dictating complex topics, but require slightly more CPU power.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1f2a1d] text-white/70 py-16 px-4 sm:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white tracking-tight">WoiceFlow</span>
            <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded text-white/60">v1.0.0</span>
          </div>
          
          <div className="flex gap-8 text-sm">
            <a href="#why-us" className="hover:text-white transition-colors">Technology</a>
            <a href="#timeline" className="hover:text-white transition-colors">How It Works</a>
            <a href="#feature-tree" className="hover:text-white transition-colors">Architecture</a>
            <a href="#comparisons" className="hover:text-white transition-colors">Comparisons</a>
            <a href="#guide" className="hover:text-white transition-colors">Guide</a>
          </div>

          <div className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} WoiceFlow. Built for the Fedora Linux developer community.
          </div>
        </div>
      </footer>
    </div>
  );
}
