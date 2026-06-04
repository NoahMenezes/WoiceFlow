"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Cpu, Menu, X, ArrowLeft, Layers, ShieldCheck, Compass, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
  { id: 'overview', name: 'Linux Overview', icon: Compass },
  { id: 'installer', name: 'Automated Installer', icon: Code2 },
  { id: 'gnome', name: 'GNOME Autostart', icon: Layers },
  { id: 'troubleshooting', name: 'Troubleshooting', icon: ShieldCheck },
];

export default function LinuxDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans">
      {/* Mobile Top Navbar */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#0d0f17] border-b border-white/10 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <span className="font-bold text-white tracking-tight">Linux Guide</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      <div className="flex-1 flex relative">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 z-20 bg-black/60 backdrop-blur-sm"
            />
          )}
        </AnimatePresence>

        {/* Sidebar Container */}
        <aside
          className={`fixed lg:sticky top-0 bottom-0 left-0 z-25 w-72 bg-[#0b0c12] border-r border-white/5 flex flex-col p-6 transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ height: 'calc(100vh)' }}
        >
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-sm font-semibold">Back to Home</span>
            </Link>
            <div className="mt-6">
              <span className="text-xl font-bold tracking-tight text-[#85AB8B] flex items-center gap-2">
                <Cpu className="w-5 h-5" /> Linux Setup
              </span>
              <span className="text-[10px] text-slate-500 font-semibold block mt-1">WoiceFlow Offline HUD</span>
            </div>
          </div>

          <nav className="flex-1 space-y-1.5 overflow-y-auto">
            {sections.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 border border-transparent transition-all group"
                >
                  <Icon className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                  <span className="flex-1">{item.name}</span>
                </a>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5 text-xs text-slate-500 font-medium">
            <p>© 2026 WoiceFlow</p>
            <p className="mt-1">Wayland virtualizer engine</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 px-6 sm:px-10 lg:px-16 py-12 max-w-5xl overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
