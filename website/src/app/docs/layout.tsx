"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, Shield, Home, Menu, X, ArrowLeft, Cpu, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
  { name: 'Introduction', href: '/docs', icon: HelpCircle },
  { name: 'Linux Setup', href: '/docs/linux', icon: Cpu, badge: 'Recommended' },
  { name: 'Windows Setup', href: '/docs/windows', icon: Terminal },
  { name: 'macOS Setup', href: '/docs/macos', icon: Shield },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans">
      {/* Mobile Top Navbar */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#0d0f17] border-b border-white/10 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#85AB8B] tracking-tight">WoiceFlow Docs</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          aria-label="Toggle Menu"
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
          className={`fixed lg:sticky top-0 bottom-0 left-0 z-25 w-72 bg-[#0c0d13] border-r border-white/5 flex flex-col p-6 transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ height: 'calc(100vh)' }}
        >
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-white hover:text-[#85AB8B] transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-sm font-semibold">Back to WoiceFlow</span>
            </Link>
            <div className="mt-6 flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">WoiceFlow Docs</span>
              <span className="text-[10px] bg-[#85AB8B]/20 text-[#85AB8B] px-2 py-0.5 rounded-full font-semibold">v1.0</span>
            </div>
          </div>

          <nav className="flex-1 space-y-1.5 overflow-y-auto">
            {navigation.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative overflow-hidden group ${
                    active
                      ? 'text-[#1f2a1d] bg-[#85AB8B]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#1f2a1d]' : 'text-slate-400 group-hover:text-white transition-colors'}`} />
                  <span className="relative z-10 flex-1">{item.name}</span>
                  {item.badge && !active && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#85AB8B]/10 text-[#85AB8B]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5 text-xs text-slate-500 font-medium">
            <p>© 2026 WoiceFlow</p>
            <p className="mt-1">Offline Dictation Engine</p>
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
