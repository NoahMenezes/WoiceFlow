"use client";

import { useState, useEffect } from 'react';
import { LogIn, UserPlus, Play, Sparkles, Menu, X, Shield, Check, Copy, Terminal, Cpu, Keyboard, Volume2, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import BoomerangVideoBg from '@/components/BoomerangVideoBg';

const BG_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_131941_d136af49-e243-493a-be14-6ff3f24e09e6.mp4';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'fedora' | 'ubuntu' | 'arch'>('fedora');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

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

  const navLinks = [
    { href: '#why', label: 'Why Offline?' },
    { href: '#compare', label: 'Comparison' },
    { href: '#setup', label: 'Installation' },
  ];

  return (
    <div className="relative w-full bg-[#090a0f]">
      {/* Hero Section */}
      <section className="sticky top-0 w-full h-screen overflow-hidden z-10">
      <BoomerangVideoBg src={BG_VIDEO} className="absolute inset-0 w-full h-full" />
      <nav className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 sm:py-6">
        <div className="flex items-center gap-2 text-[#2d3a2a]">
          <span className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight">
            WoiceFlow<sup className="text-[10px] sm:text-xs font-medium">TM</sup>
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
          <button className="ml-2 bg-[#1f2a1d] hover:bg-[#2a3827] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors">
            Try it Live
          </button>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 text-[#2d3a2a]">
          <a href="#signup" className="hidden sm:flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity">
            <UserPlus className="w-4 h-4" />
            Sign Me Up!
          </a>
          <a href="#login" className="hidden sm:flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity">
            <LogIn className="w-4 h-4" />
            Enter
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
            <a href="#signup" className="flex items-center gap-2 text-sm font-medium text-[#2d3a2a] sm:hidden">
              <UserPlus className="w-4 h-4" />
              Sign Me Up!
            </a>
            <a href="#login" className="flex items-center gap-2 text-sm font-medium text-[#2d3a2a] sm:hidden">
              <LogIn className="w-4 h-4" />
              Enter
            </a>
            <button className="mt-2 bg-[#1f2a1d] hover:bg-[#2a3827] text-white text-sm font-semibold px-5 py-3 rounded-full transition-colors">
              Try it Live
            </button>
          </div>
        </div>
      </div>

      {/* Hero copy */}
      <div className="relative z-10 flex flex-col items-center text-center pt-24 sm:pt-28 md:pt-32 px-4 sm:px-6">
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
          Shape spoken thoughts into system-wide code and inputs instantly. WoiceFlow captures, transcribes offline using Whisper, and injects text into any Linux application at <strong className="font-semibold">20x keyboard emulation speed</strong>.
        </p>
      </div>

      {/* Bottom-left CTA block */}
      <div className="absolute left-4 right-4 sm:right-auto sm:left-6 md:left-10 bottom-6 sm:bottom-8 md:bottom-10 z-10 max-w-sm">
        <div className="flex items-center gap-2 text-[#3d5638] sm:text-white/95 mb-3">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-semibold sm:font-medium">
            DictationHUD<sup className="text-[10px]">TM</sup>
          </span>
        </div>
        <p className="text-[#3d5638]/90 sm:text-white/85 text-xs leading-relaxed mb-6 max-w-xs font-medium sm:font-normal">
          A glassmorphic overlay for Fedora GNOME Wayland. It bridges the gap between hardware microphones and local AI pipelines, typing straight into your active application.
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          <a href="#setup" className="bg-[#3d5638] sm:bg-white hover:bg-[#2d4228] sm:hover:bg-white/90 text-white sm:text-[#1f2a1d] text-sm font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full transition-colors shadow-sm">
            Get Started
          </a>
          <a href="#why" className="text-[#3d5638] sm:text-white text-sm font-semibold sm:font-medium hover:opacity-80 transition-opacity">
            Why Offline?
          </a>
        </div>
      </div>

      {/* Bottom-right video link */}
      <div className="hidden sm:flex absolute right-6 md:right-10 bottom-8 md:bottom-10 z-10 items-center gap-2 text-white/90 text-sm">
        <button className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
          <Play className="w-3 h-3 fill-white text-white ml-0.5" />
        </button>
        <span className="font-medium">How we build?</span>
        <span className="text-white/60">1:35</span>
      </div>
      </section>

      {/* New Overlapping Section */}
      <section id="why" className="relative z-20 w-full min-h-screen bg-[#090a0f] text-white flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 py-24 border-t border-white/10 shadow-[0_-25px_50px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Lamp Background Graphics */}
        <div className="absolute top-0 left-0 right-0 h-[550px] pointer-events-none overflow-hidden z-0">
          <div className="relative flex w-full h-full scale-y-125 items-center justify-center isolate">
            <motion.div
              initial={{ opacity: 0.5, width: "15rem" }}
              whileInView={{ opacity: 1, width: "30rem" }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              style={{
                backgroundImage: `conic-gradient(from 70deg at center top, #06b6d4, transparent, transparent)`,
              }}
              className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] text-white"
            >
              <div className="absolute w-[100%] left-0 bg-[#090a0f] h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
              <div className="absolute w-40 h-[100%] left-0 bg-[#090a0f] bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0.5, width: "15rem" }}
              whileInView={{ opacity: 1, width: "30rem" }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              style={{
                backgroundImage: `conic-gradient(from 290deg at center top, transparent, transparent, #06b6d4)`,
              }}
              className="absolute inset-auto left-1/2 h-56 w-[30rem] text-white"
            >
              <div className="absolute w-40 h-[100%] right-0 bg-[#090a0f] bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
              <div className="absolute w-[100%] right-0 bg-[#090a0f] h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
            </motion.div>
            <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-[#090a0f] blur-2xl"></div>
            <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
            <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-cyan-500 opacity-50 blur-3xl"></div>
            <motion.div
              initial={{ width: "8rem" }}
              whileInView={{ width: "16rem" }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-cyan-400 blur-2xl"
            ></motion.div>
            <motion.div
              initial={{ width: "15rem" }}
              whileInView={{ width: "30rem" }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-cyan-400"
            ></motion.div>
            <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-[#090a0f]"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-6xl w-full mx-auto space-y-28">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#85AB8B]/10 border border-[#85AB8B]/20 mb-2">
              <Sparkles className="w-4 h-4 text-[#85AB8B]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#85AB8B]">Core Philosophy</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight drop-shadow-sm">
              Zero Latency. <br className="hidden sm:block" />
              <span className="text-[#a1c4a7] font-semibold">Local Execution. Wayland Native.</span>
            </h2>
            <p className="text-[#cbd5e1] text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto font-medium drop-shadow-md">
              Proprietary voice systems query distant cloud clusters, introducing connection delays and privacy hazards. WoiceFlow runs <strong className="font-semibold text-white">100% on device</strong>. It couples the low-footprint <strong className="font-semibold text-white">Faster-Whisper</strong> execution model with an automated keyboard virtualizer, bypassing Linux system-level application sandboxing cleanly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            <div className="p-10 sm:p-12 md:p-14 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 hover:border-[#85AB8B]/30 hover:bg-black/60 transition-all duration-300 group flex flex-col justify-between min-h-[350px]">
              <div>
                <div className="w-16 h-16 rounded-full bg-[#85AB8B]/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Volume2 className="w-8 h-8 text-[#85AB8B]" />
                </div>
                <h4 className="font-bold text-2xl sm:text-3xl mb-4 text-white">Local Offline Dictation</h4>
                <p className="text-base text-[#e2e8f0] leading-relaxed">
                  Fast 16kHz speech decoding completely on your device. Zero internet required, zero subscription fees, and absolute privacy.
                </p>
              </div>
            </div>

            <div className="p-10 sm:p-12 md:p-14 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 hover:border-[#85AB8B]/30 hover:bg-black/60 transition-all duration-300 group flex flex-col justify-between min-h-[350px]">
              <div>
                <div className="w-16 h-16 rounded-full bg-[#85AB8B]/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Keyboard className="w-8 h-8 text-[#85AB8B]" />
                </div>
                <h4 className="font-bold text-2xl sm:text-3xl mb-4 text-white">20x Faster Typing</h4>
                <p className="text-base text-[#e2e8f0] leading-relaxed">
                  Stream transcribes straight to the cursor position at speeds cloud pipelines cannot reach. Native integration into all Linux IDEs.
                </p>
              </div>
            </div>

            <div className="p-10 sm:p-12 md:p-14 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 hover:border-[#85AB8B]/30 hover:bg-black/60 transition-all duration-300 group flex flex-col justify-between min-h-[350px]">
              <div>
                <div className="w-16 h-16 rounded-full bg-[#85AB8B]/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Cpu className="w-8 h-8 text-[#85AB8B]" />
                </div>
                <h4 className="font-bold text-2xl sm:text-3xl mb-4 text-white">Wayland Native HUD</h4>
                <p className="text-base text-[#e2e8f0] leading-relaxed">
                  Glassmorphic GNOME overlay indicator matching native aesthetics. Bypasses app sandboxing using clean device virtualization.
                </p>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div id="compare" className="space-y-8 pt-10">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#85AB8B] bg-[#85AB8B]/10 px-3 py-1.5 rounded-full">
                Market Comparison
              </span>
              <h3 className="text-2xl sm:text-4xl font-normal text-white mt-4">
                How does WoiceFlow stack up?
              </h3>
            </div>
            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md">
              <table className="w-full border-collapse text-left text-sm sm:text-base">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="p-4 sm:p-6 font-bold text-white">Features</th>
                    <th className="p-4 sm:p-6 font-bold text-[#85AB8B]">WoiceFlow</th>
                    <th className="p-4 sm:p-6 font-bold text-[#cbd5e1]">Cloud Dictation</th>
                    <th className="p-4 sm:p-6 font-bold text-[#cbd5e1]">Manual Typing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-4 sm:p-6 font-semibold text-white">Pricing / Cost</td>
                    <td className="p-4 sm:p-6 text-[#85AB8B] font-medium flex items-center gap-1.5"><Check className="w-4 h-4" /> 100% Free (Open Source)</td>
                    <td className="p-4 sm:p-6 text-[#cbd5e1]/80">Subscription ($10-$30/mo)</td>
                    <td className="p-4 sm:p-6 text-[#cbd5e1]/80">Free (Manual labor)</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-6 font-semibold text-white">Dictation Speed</td>
                    <td className="p-4 sm:p-6 text-[#85AB8B] font-medium flex items-center gap-1.5"><Check className="w-4 h-4" /> 20x keyboard speed (Immediate)</td>
                    <td className="p-4 sm:p-6 text-[#cbd5e1]/80">Slow (~1.5s net lag)</td>
                    <td className="p-4 sm:p-6 text-[#cbd5e1]/80">Baseline typing</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-6 font-semibold text-white">Privacy & Safety</td>
                    <td className="p-4 sm:p-6 text-[#85AB8B] font-medium flex items-center gap-1.5"><Check className="w-4 h-4" /> On-Device (Zero telemetry)</td>
                    <td className="p-4 sm:p-6 text-red-400">Remote Cloud Server</td>
                    <td className="p-4 sm:p-6 text-[#cbd5e1]/80">Local inside OS</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-6 font-semibold text-white">Offline Use</td>
                    <td className="p-4 sm:p-6 text-[#85AB8B] font-medium flex items-center gap-1.5"><Check className="w-4 h-4" /> Yes (Fully offline)</td>
                    <td className="p-4 sm:p-6 text-red-400">No (Requires Network)</td>
                    <td className="p-4 sm:p-6 text-[#cbd5e1]/80">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-6 font-semibold text-white">System Integration</td>
                    <td className="p-4 sm:p-6 text-[#85AB8B] font-medium flex items-center gap-1.5"><Check className="w-4 h-4" /> Global Virtualizer</td>
                    <td className="p-4 sm:p-6 text-[#cbd5e1]/80">App Sandbox restriction</td>
                    <td className="p-4 sm:p-6 text-[#cbd5e1]/80">Standard keyboard</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Installation Guide */}
          <div id="setup" className="space-y-8 pt-10">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#85AB8B] bg-[#85AB8B]/10 px-3 py-1.5 rounded-full">
                Downloads & Setup
              </span>
              <h3 className="text-2xl sm:text-4xl font-normal text-white mt-4">
                Get started in 60 seconds
              </h3>
              <p className="text-[#cbd5e1]/70 text-sm max-w-xl mx-auto mt-2">
                Download the standalone executable for your operating system or use the terminal installation package. Zero configuration needed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <a href="/downloads/WoiceFlow-Windows.zip" className="bg-black/40 backdrop-blur-md border border-white/10 hover:border-[#85AB8B]/50 hover:bg-black/60 text-white p-8 rounded-3xl transition-all duration-300 group flex flex-col items-center">
                <div className="w-14 h-14 bg-[#85AB8B]/10 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-[#85AB8B]" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.951-1.801"/></svg>
                </div>
                <span className="font-semibold text-xl">Windows</span>
                <span className="text-sm text-[#cbd5e1] mt-2">64-bit Standalone (.exe)</span>
              </a>
              <a href="/downloads/WoiceFlow-macOS.zip" className="bg-black/40 backdrop-blur-md border border-white/10 hover:border-[#85AB8B]/50 hover:bg-black/60 text-white p-8 rounded-3xl transition-all duration-300 group flex flex-col items-center">
                <div className="w-14 h-14 bg-[#85AB8B]/10 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-[#85AB8B]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.188 15.365c-.246.331-1.229 1.549-2.583 1.549-.174 0-1.127-.27-2.613-.27-1.464 0-2.316.27-2.613.27-1.396 0-2.348-1.218-2.583-1.549-2.511-3.666-2.128-9.083 1.055-10.74 1.583-.82 3.125-.806 3.654-.806.495 0 2.213.064 3.844.82 2.623 1.258 2.597 3.513 2.532 3.753-.028.118-2.03 1.185-1.954 3.541.066 1.848 1.488 2.502 1.621 2.571-.059.186-.681 2.105-1.85 3.86z"/></svg>
                </div>
                <span className="font-semibold text-xl">macOS</span>
                <span className="text-sm text-[#cbd5e1] mt-2">Universal Binary (.dmg)</span>
              </a>
              <a href="/downloads/WoiceFlow-Linux.zip" className="bg-black/40 backdrop-blur-md border border-white/10 hover:border-[#85AB8B]/50 hover:bg-black/60 text-white p-8 rounded-3xl transition-all duration-300 group flex flex-col items-center">
                <div className="w-14 h-14 bg-[#85AB8B]/10 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Cpu className="w-7 h-7 text-[#85AB8B]" />
                </div>
                <span className="font-semibold text-xl">Linux</span>
                <span className="text-sm text-[#cbd5e1] mt-2">Portable Executable</span>
              </a>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 mt-12">
              <h4 className="text-white font-semibold flex items-center gap-2"><Terminal className="w-5 h-5 text-[#85AB8B]"/> Developer Terminal Installation</h4>
              {/* Tab Selector */}
              <div className="flex gap-2 border-b border-white/10 pb-4 overflow-x-auto">
                {(['fedora', 'ubuntu', 'arch'] as const).map((distro) => (
                  <button
                    key={distro}
                    onClick={() => setActiveTab(distro)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === distro
                        ? 'bg-[#85AB8B] text-[#1f2a1d]'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {distro === 'fedora' ? 'Fedora GNOME' : distro === 'ubuntu' ? 'Ubuntu/Debian' : 'Arch Linux'}
                  </button>
                ))}
              </div>

              {/* Terminal Codeblock */}
              <div className="relative rounded-2xl bg-black/60 border border-white/10 p-5 font-mono text-sm overflow-hidden group">
                <div className="absolute right-4 top-4 flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(
                      activeTab === 'fedora'
                        ? 'sudo dnf install -y python3-pip pipx portaudio-devel\npipx install woiceflow-hud\nwoiceflow-hud setup-gnome'
                        : activeTab === 'ubuntu'
                        ? 'sudo apt-get install -y python3-pip python3-venv libasound2-dev\npipx install woiceflow-hud\nwoiceflow-hud setup-gnome'
                        : 'sudo pacman -S python-pip python-pipx portaudio\npipx install woiceflow-hud\nwoiceflow-hud setup-gnome'
                    )}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                    title="Copy command"
                  >
                    {copiedText ? (
                      <span className="text-xs text-[#85AB8B] font-sans font-semibold">Copied!</span>
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="text-white/40 mb-2 flex items-center gap-1.5 select-none">
                  <Terminal className="w-4 h-4" />
                  <span>Terminal</span>
                </div>
                <pre className="text-white overflow-x-auto whitespace-pre pr-12">
                  {activeTab === 'fedora' && (
                    <>
                      <span className="text-[#85AB8B]"># Install system dependencies</span>{"\n"}
                      sudo dnf install -y python3-pip pipx portaudio-devel{"\n\n"}
                      <span className="text-[#85AB8B]"># Install offline HUD utility</span>{"\n"}
                      pipx install woiceflow-hud{"\n\n"}
                      <span className="text-[#85AB8B]"># Link Wayland virtual input virtualization</span>{"\n"}
                      woiceflow-hud setup-gnome
                    </>
                  )}
                  {activeTab === 'ubuntu' && (
                    <>
                      <span className="text-[#85AB8B]"># Install system dependencies</span>{"\n"}
                      sudo apt-get install -y python3-pip python3-venv libasound2-dev{"\n\n"}
                      <span className="text-[#85AB8B]"># Install offline HUD utility</span>{"\n"}
                      pipx install woiceflow-hud{"\n\n"}
                      <span className="text-[#85AB8B]"># Link Wayland virtual input virtualization</span>{"\n"}
                      woiceflow-hud setup-gnome
                    </>
                  )}
                  {activeTab === 'arch' && (
                    <>
                      <span className="text-[#85AB8B]"># Install system dependencies</span>{"\n"}
                      sudo pacman -S python-pip python-pipx portaudio{"\n\n"}
                      <span className="text-[#85AB8B]"># Install offline HUD utility</span>{"\n"}
                      pipx install woiceflow-hud{"\n\n"}
                      <span className="text-[#85AB8B]"># Link Wayland virtual input virtualization</span>{"\n"}
                      woiceflow-hud setup-gnome
                    </>
                  )}
                </pre>
              </div>
            </div>
          </div>

          {/* Documentation Section */}
          <div className="space-y-8 pt-10">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#85AB8B] bg-[#85AB8B]/10 px-3 py-1.5 rounded-full">
                Documentation
              </span>
              <h3 className="text-2xl sm:text-4xl font-normal text-white mt-4">
                Configuration & Hotkeys
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-3xl bg-black/40 border border-white/10 space-y-4">
                <h4 className="font-bold text-xl text-white">1. Map Key Bindings</h4>
                <p className="text-sm text-[#cbd5e1] leading-relaxed">
                  WoiceFlow works as an overlay. You trigger it via GNOME system hotkeys. Go to your Gnome Settings → Keyboard → Keyboard Shortcuts → Custom Shortcuts, and map a shortcut (e.g. <kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-xs">Super + V</kbd>) to run:
                </p>
                <div className="bg-black/60 rounded-xl p-3 font-mono text-xs text-[#85AB8B]">
                  woiceflow-hud toggle
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-black/40 border border-white/10 space-y-4">
                <h4 className="font-bold text-xl text-white">2. Select Your Whisper Model</h4>
                <p className="text-sm text-[#cbd5e1] leading-relaxed">
                  Upon first run, WoiceFlow downloads the low-footprint <strong>Faster-Whisper Tiny</strong> model by default (~70MB). You can switch models in the tray options:
                </p>
                <div className="bg-black/60 rounded-xl p-3 font-mono text-xs text-[#85AB8B]">
                  woiceflow-hud --model base --language en
                </div>
              </div>
            </div>
          </div>

          {/* Stack & Architecture Marketing Section */}
          <div className="space-y-12 pt-16 border-t border-white/10">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#85AB8B] bg-[#85AB8B]/10 px-3 py-1.5 rounded-full">
                Stack Architecture
              </span>
              <h3 className="text-2xl sm:text-4xl font-normal text-white mt-4">
                Engineered for Peak Performance
              </h3>
              <p className="text-[#cbd5e1]/70 text-sm max-w-xl mx-auto mt-2">
                Built with next-generation layout loops and cached execution buffers to maximize UI fluidness.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h4 className="text-xl sm:text-2xl font-semibold text-white">Lightweight, Open & Blazing Fast</h4>
                <p className="text-[#cbd5e1] leading-relaxed text-sm sm:text-base">
                  WoiceFlow&apos;s site is crafted using the same micro-optimization principles as the desktop utility. Built on <strong>Next.js 16 (App Router)</strong>, compiled via <strong>Bun</strong>, and styled using <strong>Tailwind CSS</strong> to guarantee instant loads and zero frame drops on high-DPI displays.
                </p>
                <div className="flex flex-wrap gap-3">
                  {['Next.js 16', 'Bun Engine', 'TypeScript', 'Tailwind v4', 'Lucide Icons'].map((tech) => (
                    <span key={tech} className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white/5 border border-white/10 text-white/80">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-black/40 border border-white/10 p-8 rounded-3xl space-y-6">
                <h5 className="font-bold text-white text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#85AB8B]" />
                  Boomerang Video Buffer Optimization
                </h5>
                <ul className="space-y-4 text-sm text-[#cbd5e1]">
                  <li className="flex gap-3">
                    <span className="text-[#85AB8B] font-bold">✔</span>
                    <span><strong>Double Buffering:</strong> Automatically swaps render canvases to eliminate loops flickering.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#85AB8B] font-bold">✔</span>
                    <span><strong>Resolution Limiting:</strong> Caps frame captures at 960px width, preventing layout lag.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#85AB8B] font-bold">✔</span>
                    <span><strong>Tick Sync:</strong> Keeps performance timing loops synchronized directly with your system hardware.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Premium Features Grid (Asymmetric) */}
          <div className="space-y-12 pt-16 border-t border-white/10">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#85AB8B] bg-[#85AB8B]/10 px-3 py-1.5 rounded-full">
                Features Dashboard
              </span>
              <h3 className="text-2xl sm:text-4xl font-normal text-white mt-4">
                Sleek Design. Local Execution.
              </h3>
            </div>

            <div className="relative z-10 grid grid-cols-6 gap-6">
              {/* Card 1: Customizable */}
              <div className="relative col-span-full lg:col-span-2 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
                <div className="p-8 flex flex-col justify-between h-full min-h-[320px]">
                  <div className="relative flex h-24 w-full items-center justify-center">
                    <svg className="text-[#85AB8B]/20 absolute inset-0 w-full h-full" viewBox="0 0 254 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="mx-auto block w-fit text-5xl font-bold text-white relative z-10">100%</span>
                  </div>
                  <div className="space-y-2 mt-4 text-center">
                    <h4 className="text-lg font-semibold text-white">Highly Customizable</h4>
                    <p className="text-sm text-[#cbd5e1]">Configure custom local Whisper models, user triggered system bounds, and dictation HUD shortcuts.</p>
                  </div>
                </div>
              </div>

              {/* Card 2: Secure by Default */}
              <div className="relative col-span-full sm:col-span-3 lg:col-span-2 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
                <div className="p-8 flex flex-col justify-between h-full min-h-[320px]">
                  <div className="relative mx-auto flex aspect-square size-32 rounded-full border border-white/10 before:absolute before:-inset-2 before:rounded-full before:border before:border-white/5">
                    <svg className="m-auto h-fit w-24 text-zinc-500" viewBox="0 0 212 143" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        className="text-[#85AB8B]"
                        d="M44.0209 55.3542C43.1945 54.7639 42.6916 54.0272 42.5121 53.1442C42.3327 52.2611 42.5995 51.345 43.3125 50.3958C50.632 40.3611 59.812 32.5694 70.8525 27.0208C81.8931 21.4722 93.668 18.6979 106.177 18.6979C118.691 18.6979 130.497 21.3849 141.594 26.7587C152.691 32.1326 161.958 39.8936 169.396 50.0417C170.222 51.1042 170.489 52.0486 170.196 52.875C169.904 53.7014 169.401 54.4097 168.688 55C167.979 55.5903 167.153 55.8571 166.208 55.8004C165.264 55.7437 164.438 55.2408 163.729 54.2917C157.236 45.0833 148.885 38.0307 138.675 33.1337C128.466 28.2368 117.633 25.786 106.177 25.7812C94.7257 25.7812 83.9827 28.2321 73.948 33.1337C63.9132 38.0354 55.5903 45.0881 48.9792 54.2917C48.2709 55.3542 47.4445 55.9444 46.5 56.0625C45.5556 56.1806 44.7292 55.9444 44.0209 55.3542ZM126.188 142.656C113.91 139.587 103.875 133.476 96.0834 124.325C88.2917 115.173 84.3959 103.988 84.3959 90.7708C84.3959 84.8681 86.5209 79.9097 90.7709 75.8958C95.0209 71.8819 100.156 69.875 106.177 69.875C112.198 69.875 117.333 71.8819 121.583 75.8958C125.833 79.9097 127.958 84.8681 127.958 90.7708C127.958 94.6667 129.434 97.9439 132.385 100.602C135.337 103.261 138.819 104.588 142.833 104.583C146.847 104.583 150.271 103.256 153.104 100.602C155.938 97.9486 157.354 94.6714 157.354 90.7708C157.354 77.0764 152.337 65.566 142.302 56.2396C132.267 46.9132 120.285 42.25 106.354 42.25C92.4237 42.25 80.441 46.9132 70.4063 56.2396C60.3716 65.566 55.3542 77.0174 55.3542 90.5937C55.3542 93.4271 55.621 96.9687 56.1546 101.219C56.6882 105.469 57.9562 110.427 59.9584 116.094C60.3125 117.156 60.2842 118.101 59.8734 118.927C59.4625 119.753 58.7825 120.344 57.8334 120.698C56.8889 121.052 55.9752 121.024 55.0921 120.613C54.2091 120.202 53.5881 119.522 53.2292 118.573C51.4584 113.969 50.1905 109.395 49.4255 104.853C48.6605 100.31 48.2756 95.6158 48.2709 90.7708C48.2709 75.0694 53.9682 61.9062 65.363 51.2812C76.7577 40.6562 90.3624 35.3437 106.177 35.3437C122.115 35.3437 135.809 40.6562 147.26 51.2812C158.712 61.9062 164.438 75.0694 164.438 90.7708C164.438 96.6736 162.343 101.601 158.155 105.554C153.966 109.506 148.859 111.485 142.833 111.49C136.813 111.49 131.649 109.513 127.342 105.561C123.035 101.608 120.88 96.6783 120.875 90.7708C120.875 86.875 119.43 83.5978 116.54 80.9392C113.65 78.2805 110.196 76.9536 106.177 76.9583C102.163 76.9583 98.7089 78.2876 95.8142 80.9462C92.9195 83.6049 91.4745 86.8797 91.4792 90.7708C91.4792 102.222 94.8745 111.785 101.665 119.458C108.456 127.132 117.22 132.503 127.958 135.573C129.021 135.927 129.729 136.517 130.083 137.344C130.438 138.17 130.497 139.056 130.26 140C130.024 140.826 129.552 141.535 128.844 142.125C128.135 142.715 127.25 142.892 126.188 142.656ZM67.0417 18.3437C66.0973 18.934 65.1528 19.0828 64.2084 18.79C63.2639 18.4972 62.5556 17.8762 62.0834 16.9271C61.6112 15.9826 61.4931 15.1279 61.7292 14.3629C61.9653 13.5979 62.5556 12.9179 63.5 12.3229C70.1112 8.78125 77.0174 6.06597 84.2188 4.17708C91.4202 2.28819 98.7396 1.34375 106.177 1.34375C113.733 1.34375 121.111 2.25986 128.313 4.09208C135.514 5.92431 142.479 8.54986 149.208 11.9687C150.271 12.559 150.892 13.2674 151.071 14.0937C151.251 14.9201 151.161 15.7465 150.802 16.5729C150.448 17.3993 149.858 18.0486 149.031 18.5208C148.205 18.9931 147.201 18.934 146.021 18.3437C139.764 15.1563 133.299 12.7078 126.627 10.9983C119.954 9.28889 113.138 8.43181 106.177 8.42708C99.3299 8.42708 92.6007 9.22514 85.9896 10.8212C79.3785 12.4174 73.0625 14.9249 67.0417 18.3437ZM87.9375 140.177C80.9723 132.858 75.6314 125.392 71.915 117.78C68.1987 110.167 66.3381 101.164 66.3334 90.7708C66.3334 80.0278 70.2292 70.9658 78.0209 63.585C85.8125 56.2042 95.198 52.5161 106.177 52.5208C117.156 52.5208 126.601 56.2112 134.51 63.5921C142.42 70.9729 146.375 80.0325 146.375 90.7708C146.375 91.8333 146.052 92.6904 145.405 93.3421C144.758 93.9937 143.901 94.3172 142.833 94.3125C141.889 94.3125 141.063 93.989 140.354 93.3421C139.646 92.6951 139.292 91.8381 139.292 90.7708C139.292 81.9167 136.014 74.5099 129.46 68.5504C122.906 62.591 115.145 59.6089 106.177 59.6042C97.2049 59.6042 89.503 62.5862 83.0713 68.5504C76.6396 74.5146 73.4214 81.9214 73.4167 90.7708C73.4167 100.333 75.0695 108.451 78.375 115.123C81.6806 121.796 86.5209 128.494 92.8959 135.219C93.6042 135.927 93.9584 136.753 93.9584 137.698C93.9584 138.642 93.6042 139.469 92.8959 140.177C92.1875 140.885 91.3612 141.24 90.4167 141.24C89.4723 141.24 88.6459 140.885 87.9375 140.177ZM141.417 128.135C130.91 128.135 121.789 124.594 114.054 117.51C106.319 110.427 102.454 101.514 102.458 90.7708C102.458 89.8264 102.784 89 103.436 88.2917C104.088 87.5833 104.942 87.2292 106 87.2292C107.063 87.2292 107.92 87.5833 108.571 88.2917C109.223 89 109.546 89.8264 109.542 90.7708C109.542 99.625 112.729 106.885 119.104 112.552C125.479 118.219 132.917 121.052 141.417 121.052C142.125 121.052 143.129 120.993 144.427 120.875C145.726 120.757 147.083 120.58 148.5 120.344C149.563 120.108 150.479 120.256 151.248 120.79C152.018 121.324 152.519 122.119 152.75 123.177C152.986 124.122 152.809 124.948 152.219 125.656C151.629 126.365 150.861 126.837 149.917 127.073C147.792 127.663 145.934 127.989 144.342 128.05C142.751 128.112 141.776 128.14 141.417 128.135Z"
                        fill="currentColor"
                      />
                      <g clipPath="url(#clip0_0_1)">
                        <path
                          d="M44.0209 55.3542C43.1945 54.7639 42.6916 54.0272 42.5121 53.1442C42.3327 52.2611 42.5995 51.345 43.3125 50.3958C50.632 40.3611 59.812 32.5694 70.8525 27.0208C81.8931 21.4722 93.668 18.6979 106.177 18.6979C118.691 18.6979 130.497 21.3849 141.594 26.7587C152.691 32.1326 161.958 39.8936 169.396 50.0417C170.222 51.1042 170.489 52.0486 170.196 52.875C169.904 53.7014 169.401 54.4097 168.688 55C167.979 55.5903 167.153 55.8571 166.208 55.8004C165.264 55.7437 164.438 55.2408 163.729 54.2917C157.236 45.0833 148.885 38.0307 138.675 33.1337C128.466 28.2368 117.633 25.786 106.177 25.7812C94.7257 25.7812 83.9827 28.2321 73.948 33.1337C63.9132 38.0354 55.5903 45.0881 48.9792 54.2917C48.2709 55.3542 47.4445 55.9444 46.5 56.0625C45.5556 56.1806 44.7292 55.9444 44.0209 55.3542ZM126.188 142.656C113.91 139.587 103.875 133.476 96.0834 124.325C88.2917 115.173 84.3959 103.988 84.3959 90.7708C84.3959 84.8681 86.5209 79.9097 90.7709 75.8958C95.0209 71.8819 100.156 69.875 106.177 69.875C112.198 69.875 117.333 71.8819 121.583 75.8958C125.833 79.9097 127.958 84.8681 127.958 90.7708C127.958 94.6667 129.434 97.9439 132.385 100.602C135.337 103.261 138.819 104.588 142.833 104.583C146.847 104.583 150.271 103.256 153.104 100.602C155.938 97.9486 157.354 94.6714 157.354 90.7708C157.354 77.0764 152.337 65.566 142.302 56.2396C132.267 46.9132 120.285 42.25 106.354 42.25C92.4237 42.25 80.441 46.9132 70.4063 56.2396C60.3716 65.566 55.3542 77.0174 55.3542 90.5937C55.3542 93.4271 55.621 96.9687 56.1546 101.219C56.6882 105.469 57.9562 110.427 59.9584 116.094C60.3125 117.156 60.2842 118.101 59.8734 118.927C59.4625 119.753 58.7825 120.344 57.8334 120.698C56.8889 121.052 55.9752 121.024 55.0921 120.613C54.2091 120.202 53.5881 119.522 53.2292 118.573C51.4584 113.969 50.1905 109.395 49.4255 104.853C48.6605 100.31 48.2756 95.6158 48.2709 90.7708C48.2709 75.0694 53.9682 61.9062 65.363 51.2812C76.7577 40.6562 90.3624 35.3437 106.177 35.3437C122.115 35.3437 135.809 40.6562 147.26 51.2812C158.712 61.9062 164.438 75.0694 164.438 90.7708C164.438 96.6736 162.343 101.601 158.155 105.554C153.966 109.506 148.859 111.485 142.833 111.49C136.813 111.49 131.649 109.513 127.342 105.561C123.035 101.608 120.88 96.6783 120.875 90.7708C120.875 86.875 119.43 83.5978 116.54 80.9392C113.65 78.2805 110.196 76.9536 106.177 76.9583C102.163 76.9583 98.7089 78.2876 95.8142 80.9462C92.9195 83.6049 91.4745 86.8797 91.4792 90.7708C91.4792 102.222 94.8745 111.785 101.665 119.458C108.456 127.132 117.22 132.503 127.958 135.573C129.021 135.927 129.729 136.517 130.083 137.344C130.438 138.17 130.497 139.056 130.26 140C130.024 140.826 129.552 141.535 128.844 142.125C128.135 142.715 127.25 142.892 126.188 142.656ZM67.0417 18.3437C66.0973 18.934 65.1528 19.0828 64.2084 18.79C63.2639 18.4972 62.5556 17.8762 62.0834 16.9271C61.6112 15.9826 61.4931 15.1279 61.7292 14.3629C61.9653 13.5979 62.5556 12.9179 63.5 12.3229C70.1112 8.78125 77.0174 6.06597 84.2188 4.17708C91.4202 2.28819 98.7396 1.34375 106.177 1.34375C113.733 1.34375 121.111 2.25986 128.313 4.09208C135.514 5.92431 142.479 8.54986 149.208 11.9687C150.271 12.559 150.892 13.2674 151.071 14.0937C151.251 14.9201 151.161 15.7465 150.802 16.5729C150.448 17.3993 149.858 18.0486 149.031 18.5208C148.205 18.9931 147.201 18.934 146.021 18.3437C139.764 15.1563 133.299 12.7078 126.627 10.9983C119.954 9.28889 113.138 8.43181 106.177 8.42708C99.3299 8.42708 92.6007 9.22514 85.9896 10.8212C79.3785 12.4174 73.0625 14.9249 67.0417 18.3437ZM87.9375 140.177C80.9723 132.858 75.6314 125.392 71.915 117.78C68.1987 110.167 66.3381 101.164 66.3334 90.7708C66.3334 80.0278 70.2292 70.9658 78.0209 63.585C85.8125 56.2042 95.198 52.5161 106.177 52.5208C117.156 52.5208 126.601 56.2112 134.51 63.5921C142.42 70.9729 146.375 80.0325 146.375 90.7708C146.375 91.8333 146.052 92.6904 145.405 93.3421C144.758 93.9937 143.901 94.3172 142.833 94.3125C141.889 94.3125 141.063 93.989 140.354 93.3421C139.646 92.6951 139.292 91.8381 139.292 90.7708C139.292 81.9167 136.014 74.5099 129.46 68.5504C122.906 62.591 115.145 59.6089 106.177 59.6042C97.2049 59.6042 89.503 62.5862 83.0713 68.5504C76.6396 74.5146 73.4214 81.9214 73.4167 90.7708C73.4167 100.333 75.0695 108.451 78.375 115.123C81.6806 121.796 86.5209 128.494 92.8959 135.219C93.6042 135.927 93.9584 136.753 93.9584 137.698C93.9584 138.642 93.6042 139.469 92.8959 140.177C92.1875 140.885 91.3612 141.24 90.4167 141.24C89.4723 141.24 88.6459 140.885 87.9375 140.177ZM141.417 128.135C130.91 128.135 121.789 124.594 114.054 117.51C106.319 110.427 102.454 101.514 102.458 90.7708C102.458 89.8264 102.784 89 103.436 88.2917C104.088 87.5833 104.942 87.2292 106 87.2292C107.063 87.2292 107.92 87.5833 108.571 88.2917C109.223 89 109.546 89.8264 109.542 90.7708C109.542 99.625 112.729 106.885 119.104 112.552C125.479 118.219 132.917 121.052 141.417 121.052C142.125 121.052 143.129 120.993 144.427 120.875C145.726 120.757 147.083 120.58 148.5 120.344C149.563 120.108 150.479 120.256 151.248 120.79C152.018 121.324 152.519 122.119 152.75 123.177C152.986 124.122 152.809 124.948 152.219 125.656C151.629 126.365 150.861 126.837 149.917 127.073C147.792 127.663 145.934 127.989 144.342 128.05C142.751 128.112 141.776 128.14 141.417 128.135Z"
                        fill="url(#paint0_linear_0_1)"
                      />
                    </g>
                    <path className="text-[#85AB8B]" d="M3 72H209" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="paint0_linear_0_1" x1="106.385" y1="1.34375" x2="106" y2="72" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white" stopOpacity="0" />
                        <stop className="text-[#85AB8B]" offset="1" stopColor="currentColor" />
                      </linearGradient>
                      <clipPath id="clip0_0_1">
                        <rect width="129" height="72" fill="white" transform="translate(41)" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div className="relative z-10 mt-6 space-y-2 text-center p-6">
                  <h4 className="text-lg font-semibold text-white">Secure by Design</h4>
                  <p className="text-sm text-[#cbd5e1]">All voice processing executes locally on device. Zero external queries or data leaks.</p>
                </div>
              </div>
            </div>

              {/* Card 3: Faster than light */}
              <div className="relative col-span-full sm:col-span-3 lg:col-span-2 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
                <div className="p-8 flex flex-col justify-between h-full min-h-[320px]">
                  <div className="pt-6">
                    <svg className="w-full text-[#85AB8B]" viewBox="0 0 386 123" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="386" height="123" rx="10" />
                      <g clipPath="url(#clip0_0_106)">
                        <circle className="text-[#85AB8B]/20" cx="29" cy="29" r="15" fill="currentColor" />
                        <path d="M29 23V35" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M35 29L29 35L23 29" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path
                          d="M55.2373 32H58.7988C61.7383 32 63.4404 30.1816 63.4404 27.0508V27.0371C63.4404 23.9404 61.7246 22.1357 58.7988 22.1357H55.2373V32ZM56.7686 30.6807V23.4551H58.6279C60.6719 23.4551 61.8818 24.7881 61.8818 27.0576V27.0713C61.8818 29.3613 60.6924 30.6807 58.6279 30.6807H56.7686ZM69.4922 32.1436C71.666 32.1436 72.999 30.6875 72.999 28.2949V28.2812C72.999 25.8887 71.6592 24.4326 69.4922 24.4326C67.3184 24.4326 65.9785 25.8955 65.9785 28.2812V28.2949C65.9785 30.6875 67.3115 32.1436 69.4922 32.1436ZM69.4922 30.9062C68.2139 30.9062 67.4961 29.9424 67.4961 28.2949V28.2812C67.4961 26.6338 68.2139 25.6699 69.4922 25.6699C70.7637 25.6699 71.4883 26.6338 71.4883 28.2812V28.2949C71.4883 29.9355 70.7637 30.9062 69.4922 30.9062ZM76.9111 32H78.4219L79.9531 26.4629H80.0693L81.6074 32H83.1318L85.1758 24.5762H83.7061L82.3799 30.3047H82.2637L80.7324 24.5762H79.3242L77.793 30.3047H77.6836L76.3506 24.5762H74.8604L76.9111 32ZM87.6934 32H89.1768V27.6455C89.1768 26.4492 89.8535 25.7041 90.9404 25.7041C92.0273 25.7041 92.54 26.3125 92.54 27.543V32H94.0166V27.1943C94.0166 25.4238 93.1006 24.4326 91.4395 24.4326C90.3594 24.4326 89.6484 24.9111 89.2861 25.7041H89.1768V24.5762H87.6934V32ZM97.1562 32H98.6396V21.6641H97.1562V32ZM104.992 32.1436C107.166 32.1436 108.499 30.6875 108.499 28.2949V28.2812C108.499 25.8887 107.159 24.4326 104.992 24.4326C102.818 24.4326 101.479 25.8955 101.479 28.2812V28.2949C101.479 30.6875 102.812 32.1436 104.992 32.1436ZM104.992 30.9062C103.714 30.9062 102.996 29.9424 102.996 28.2949V28.2812C102.996 26.6338 103.714 25.6699 104.992 25.6699C106.264 25.6699 106.988 26.6338 106.988 28.2812V28.2949C106.988 29.9355 106.264 30.9062 104.992 30.9062ZM113.307 32.123C114.291 32.123 115.07 31.6992 115.508 30.9473H115.624V32H117.094V26.9209C117.094 25.3623 116.041 24.4326 114.175 24.4326C112.486 24.4326 111.317 25.2461 111.14 26.4629L111.133 26.5107H112.562L112.568 26.4834C112.746 25.957 113.286 25.6562 114.106 25.6562C115.111 25.6562 115.624 26.1074 115.624 26.9209V27.5771L113.614 27.6934C111.844 27.8027 110.846 28.5752 110.846 29.9014V29.915C110.846 31.2617 111.892 32.123 113.307 32.123ZM112.322 29.8535V29.8398C112.322 29.1699 112.787 28.8008 113.812 28.7393L115.624 28.623V29.2588C115.624 30.2158 114.811 30.9404 113.703 30.9404C112.903 30.9404 112.322 30.5371 112.322 29.8535ZM122.893 32.123C123.932 32.123 124.745 31.6445 125.176 30.8311H125.292V32H126.769V21.6641H125.292V25.752H125.176C124.779 24.9521 123.911 24.4463 122.893 24.4463C121.006 24.4463 119.816 25.9297 119.816 28.2812V28.2949C119.816 30.626 121.026 32.123 122.893 32.123ZM123.316 30.8584C122.072 30.8584 121.327 29.8877 121.327 28.2949V28.2812C121.327 26.6885 122.072 25.7178 123.316 25.7178C124.547 25.7178 125.312 26.6953 125.312 28.2812V28.2949C125.312 29.8809 124.554 30.8584 123.316 30.8584Z"
                          fill="currentColor"
                        />
                      </g>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3 123C3 123 14.3298 94.153 35.1282 88.0957C55.9266 82.0384 65.9333 80.5508 65.9333 80.5508C65.9333 80.5508 80.699 80.5508 92.1777 80.5508C103.656 80.5508 100.887 63.5348 109.06 63.5348C117.233 63.5348 117.217 91.9728 124.78 91.9728C132.343 91.9728 142.264 78.03 153.831 80.5508C165.398 83.0716 186.825 91.9728 193.761 91.9728C200.697 91.9728 206.296 63.5348 214.07 63.5348C221.844 63.5348 238.653 93.7771 244.234 91.9728C249.814 90.1684 258.8 60 266.19 60C272.075 60 284.1 88.057 286.678 88.0957C294.762 88.2171 300.192 72.9284 305.423 72.9284C312.323 72.9284 323.377 65.2437 335.553 63.5348C347.729 61.8259 348.218 82.07 363.639 80.5508C367.875 80.1335 372.949 82.2017 376.437 87.1008C379.446 91.3274 381.054 97.4325 382.521 104.647C383.479 109.364 382.521 123 382.521 123"
                        fill="url(#paint0_linear_0_106)"
                      />
                      <path
                        className="text-[#85AB8B]"
                        d="M3 121.077C3 121.077 15.3041 93.6691 36.0195 87.756C56.7349 81.8429 66.6632 80.9723 66.6632 80.9723C66.6632 80.9723 80.0327 80.9723 91.4656 80.9723C102.898 80.9723 100.415 64.2824 108.556 64.2824C116.696 64.2824 117.693 92.1332 125.226 92.1332C132.759 92.1332 142.07 78.5115 153.591 80.9723C165.113 83.433 186.092 92.1332 193 92.1332C199.908 92.1332 205.274 64.2824 213.017 64.2824C220.76 64.2824 237.832 93.8946 243.39 92.1332C248.948 90.3718 257.923 60.5 265.284 60.5C271.145 60.5 283.204 87.7182 285.772 87.756C293.823 87.8746 299.2 73.0802 304.411 73.0802C311.283 73.0802 321.425 65.9506 333.552 64.2824C345.68 62.6141 346.91 82.4553 362.27 80.9723C377.629 79.4892 383 106.605 383 106.605"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <defs>
                        <linearGradient id="paint0_linear_0_106" x1="3" y1="60" x2="3" y2="123" gradientUnits="userSpaceOnUse">
                          <stop className="text-[#85AB8B]/10" stopColor="currentColor" />
                          <stop className="text-transparent" offset="1" stopColor="currentColor" stopOpacity="0.1" />
                        </linearGradient>
                        <clipPath id="clip0_0_106">
                          <rect width="358" height="30" fill="white" transform="translate(14 14)" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div className="relative z-10 mt-14 space-y-2 text-center">
                    <h4 className="text-lg font-semibold text-white">Sub-150ms Speed</h4>
                    <p className="text-sm text-[#cbd5e1]">Speech is processed instantly on device, running keyboard events at maximum bus limits.</p>
                  </div>
                </div>
              </div>

              {/* Card 4: Contribution Community */}
              <div className="relative col-span-full lg:col-span-3 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
                <div className="p-8 grid sm:grid-cols-2 h-full min-h-[300px] items-center">
                  <div className="relative z-10 flex flex-col justify-between space-y-12">
                    <div className="relative flex aspect-square size-12 rounded-full border border-white/10 before:absolute before:-inset-2 before:rounded-full before:border before:border-white/5">
                      <Shield className="m-auto size-5 text-[#85AB8B]" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-white">System Sandboxing Bypassed</h4>
                      <p className="text-sm text-[#cbd5e1]">Clean, user-space virtual inputs that do not violate Linux safety policies or sandboxing rules.</p>
                    </div>
                  </div>
                  <div className="relative -mb-6 -mr-6 mt-6 h-fit border-l border-t border-white/10 p-6 sm:ml-6 rounded-tl-3xl bg-black/50">
                    <div className="absolute left-3 top-2 flex gap-1">
                      <span className="block size-2 rounded-full border border-white/10 bg-white/10"></span>
                      <span className="block size-2 rounded-full border border-white/10 bg-white/10"></span>
                      <span className="block size-2 rounded-full border border-white/10 bg-white/10"></span>
                    </div>
                    <svg className="w-full sm:w-[150%] text-[#85AB8B]" viewBox="0 0 366 231" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.148438 231V179.394L1.92188 180.322L2.94482 177.73L4.05663 183.933L6.77197 178.991L7.42505 184.284L9.42944 187.985L11.1128 191.306V155.455L13.6438 153.03V145.122L14.2197 142.829V150.454V154.842L15.5923 160.829L17.0793 172.215H19.2031V158.182L20.7441 153.03L22.426 148.111V142.407L24.7471 146.86V128.414L26.7725 129.918V120.916L28.1492 118.521L28.4653 127.438L29.1801 123.822L31.0426 120.525V130.26L32.3559 134.71L34.406 145.122V137.548L35.8982 130.26L37.1871 126.049L38.6578 134.71L40.659 138.977V130.26V126.049L43.7557 130.26V123.822L45.972 112.407L47.3391 103.407V92.4726L49.2133 98.4651V106.053L52.5797 89.7556L54.4559 82.7747L56.1181 87.9656L58.9383 89.7556V98.4651L60.7617 103.407L62.0545 123.822L63.8789 118.066L65.631 122.082L68.5479 114.229L70.299 109.729L71.8899 118.066L73.5785 123.822V130.26L74.9446 134.861L76.9243 127.87L78.352 134.71V138.977L80.0787 142.407V152.613L83.0415 142.407V130.26L86.791 123.822L89.0121 116.645V122.082L90.6059 127.87L92.3541 131.77L93.7104 123.822L95.4635 118.066L96.7553 122.082V137.548L99.7094 140.988V131.77L101.711 120.525L103.036 116.645V133.348L104.893 136.218L106.951 140.988L108.933 134.71L110.797 130.26L112.856 140.988V148.111L115.711 152.613L117.941 145.122L119.999 140.988V148.111L123.4 152.613L125.401 158.182L130.547 150.454V156.566L131.578 155.455L134.143 158.182L135.594 168.136L138.329 158.182L140.612 160.829L144.681 169.5L147.011 155.455L148.478 151.787L151.02 152.613L154.886 145.122L158 143.412L159.406 140.637L159.496 133.348L162.295 127.87V122.082L163.855 116.645V109.729L164.83 104.407L166.894 109.729L176.249 98.4651L178.254 106.169L180.77 98.4651V81.045L182.906 69.1641L184.8 56.8669L186.477 62.8428L187.848 79.7483L188.849 106.169L191.351 79.7483L193.485 75.645V98.4651L196.622 94.4523L198.623 87.4228V79.7483L200.717 75.645L202.276 81.045V89.3966L203.638 113.023L205.334 99.8037L207.164 94.4523L208.982 98.4651V102.176L211.267 107.64L212.788 81.045L214.437 66.0083L216.19 62.8428L217.941 56.8669V73.676V79.7483L220.28 75.645L222.516 66.0083V73.676H226.174V84.8662L228.566 98.4651L230.316 75.645L233.61 94.4523V104.25L236.882 102.176L239.543 113.023L241.057 98.4651L243.604 94.4523L244.975 106.169L245.975 87.4228L247.272 89.3966L250.732 84.8662L251.733 96.7549L254.644 94.4523L257.452 99.8037L259.853 91.3111L261.193 84.8662L264.162 75.645L265.808 87.4228L267.247 58.4895L269.757 66.0083L276.625 13.5146L273.33 58.4895L276.25 67.6563L282.377 20.1968L281.37 58.4895V66.0083L283.579 75.645L286.033 56.8669L287.436 73.676L290.628 77.6636L292.414 84.8662L294.214 61.3904L296.215 18.9623L300.826 0.947876L297.531 56.8669L299.973 62.8428L305.548 22.0598L299.755 114.956L301.907 105.378L304.192 112.688V94.9932L308.009 80.0829L310.003 94.9932L311.004 102.127L312.386 105.378L315.007 112.688L316.853 98.004L318.895 105.378L321.257 94.9932L324.349 100.81L325.032 80.0829L327.604 61.5733L329.308 82.3223L333.525 52.7986L334.097 52.145L334.735 55.6812L337.369 59.8108V73.676L340.743 87.9656L343.843 96.3728L348.594 82.7747L349.607 81.045L351 89.7556L352.611 96.3728L355.149 94.9932L356.688 102.176L359.396 108.784L360.684 111.757L365 95.7607V231H148.478H0.148438Z"
                        fill="url(#paint0_linear_0_705)"
                      />
                      <path
                        className="text-[#85AB8B]/80"
                        d="M1 179.796L4.05663 172.195V183.933L7.20122 174.398L8.45592 183.933L10.0546 186.948V155.455L12.6353 152.613V145.122L15.3021 134.71V149.804V155.455L16.6916 160.829L18.1222 172.195V158.182L19.8001 152.613L21.4105 148.111V137.548L23.6863 142.407V126.049L25.7658 127.87V120.525L27.2755 118.066L29.1801 112.407V123.822L31.0426 120.525V130.26L32.3559 134.71L34.406 145.122V137.548L35.8982 130.26L37.1871 126.049L38.6578 134.71L40.659 138.977V130.26V126.049L43.7557 130.26V123.822L45.972 112.407L47.3391 103.407V92.4726L49.2133 98.4651V106.053L52.5797 89.7556L54.4559 82.7747L56.1181 87.9656L58.9383 89.7556V98.4651L60.7617 103.407L62.0545 123.822L63.8789 118.066L65.631 122.082L68.5479 114.229L70.299 109.729L71.8899 118.066L73.5785 123.822V130.26L74.9446 134.861L76.9243 127.87L78.352 134.71V138.977L80.0787 142.407V152.613L83.0415 142.407V130.26L86.791 123.822L89.0121 116.645V122.082L90.6059 127.87L92.3541 131.77L93.7104 123.822L95.4635 118.066L96.7553 122.082V137.548L99.7094 140.988V131.77L101.711 120.525L103.036 116.645V133.348L104.893 136.218L106.951 140.988L108.933 134.71L110.797 130.26L112.856 140.988V148.111L115.711 152.613L117.941 145.122L119.999 140.988L121.501 148.111L123.4 152.613L125.401 158.182L127.992 152.613L131.578 146.76V155.455L134.143 158.182L135.818 164.629L138.329 158.182L140.612 160.829L144.117 166.757L146.118 155.455L147.823 149.804L151.02 152.613L154.886 145.122L158.496 140.988V133.348L161.295 127.87V122.082L162.855 116.645V109.729L164.83 103.407L166.894 109.729L176.249 98.4651L178.254 106.169L180.77 98.4651V81.045L182.906 69.1641L184.8 56.8669L186.477 62.8428L187.848 79.7483L188.849 106.169L191.351 79.7483L193.485 75.645V98.4651L196.622 94.4523L198.623 87.4228V79.7483L200.717 75.645L202.276 81.045V89.3966L203.638 113.023L205.334 99.8037L207.164 94.4523L208.982 98.4651V102.176L211.267 107.64L212.788 81.045L214.437 66.0083L216.19 62.8428L217.941 56.8669V73.676V79.7483L220.28 75.645L222.516 66.0083V73.676H226.174V84.8662L228.566 98.4651L230.316 75.645L233.61 94.4523V104.25L236.882 102.176L239.543 113.023L241.057 98.4651L243.604 94.4523L244.975 106.169L245.975 87.4228L247.272 89.3966L250.732 84.8662L251.733 96.7549L254.644 94.4523L257.452 99.8037L259.853 91.3111L261.193 84.8662L264.162 75.645L265.808 87.4228L267.247 58.4895L269.757 66.0083L276.625 13.5146L273.33 58.4895L276.25 67.6563L282.377 20.1968L281.37 58.4895V66.0083L283.579 75.645L286.033 56.8669L287.436 73.676L290.628 77.6636L292.414 84.8662L294.214 61.3904L296.215 18.9623L300.826 0.947876L297.531 56.8669L299.973 62.8428L305.548 22.0598L299.755 114.956L301.907 105.378L304.192 112.688V94.9932L308.009 80.0829L310.003 94.9932L311.004 102.127L312.386 105.378L315.007 112.688L316.853 98.004L318.895 105.378L321.257 94.9932L324.349 100.81L325.032 80.0829L327.604 61.5733L329.357 74.9864L332.611 52.6565L334.352 48.5552L335.785 55.2637L338.377 59.5888V73.426L341.699 87.5181L343.843 93.4347L347.714 82.1171L350.229 78.6821L351.974 89.7556L353.323 94.9932L355.821 93.4347L357.799 102.127L360.684 108.794L363.219 98.004L365 89.7556"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <defs>
                        <linearGradient id="paint0_linear_0_705" x1="0.85108" y1="0.947876" x2="0.85108" y2="230.114" gradientUnits="userSpaceOnUse">
                          <stop className="text-[#85AB8B]/10" stopColor="currentColor" />
                          <stop className="text-transparent" offset="1" stopColor="currentColor" stopOpacity="0.01" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Card 5: Core Virtualizer Community */}
              <div className="relative col-span-full lg:col-span-3 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
                <div className="p-8 grid sm:grid-cols-2 h-full min-h-[300px] items-center">
                  <div className="relative z-10 flex flex-col justify-between space-y-12">
                    <div className="relative flex aspect-square size-12 rounded-full border border-white/10 before:absolute before:-inset-2 before:rounded-full before:border before:border-white/5">
                      <Users className="m-auto size-6 text-[#85AB8B]" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-white">Open & Community Maintained</h4>
                      <p className="text-sm text-[#cbd5e1]">Developed by a network of Linux power users. Clean system commits and fully audited source paths.</p>
                    </div>
                  </div>
                  <div className="relative mt-6 before:absolute before:inset-y-0 before:left-1/2 before:w-px before:bg-white/10 sm:-my-6 sm:-mr-6 h-full flex flex-col justify-center space-y-6">
                    <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-2">
                      <span className="block h-fit rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-[#cbd5e1] shadow-sm">Lead Dev</span>
                      <div className="ring-[#090a0f] size-7 ring-4 rounded-full overflow-hidden">
                        <img className="size-full" src="https://avatars.githubusercontent.com/u/102558960?v=4" alt="Lead Dev" />
                      </div>
                    </div>
                    <div className="relative ml-[calc(50%-1rem)] flex items-center gap-2">
                      <div className="ring-[#090a0f] size-8 ring-4 rounded-full overflow-hidden">
                        <img className="size-full" src="https://avatars.githubusercontent.com/u/47919550?v=4" alt="HUD Designer" />
                      </div>
                      <span className="block h-fit rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-[#cbd5e1] shadow-sm">HUD Designer</span>
                    </div>
                    <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-2">
                      <span className="block h-fit rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-[#cbd5e1] shadow-sm">Core Virtualizer</span>
                      <div className="ring-[#090a0f] size-7 ring-4 rounded-full overflow-hidden">
                        <img className="size-full" src="https://avatars.githubusercontent.com/u/31113941?v=4" alt="Core Virtualizer" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
