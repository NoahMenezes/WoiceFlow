"use client";

import React, { useState } from "react";
import SiriOrb from "@/components/smoothui/components/siri-orb";
import { Sliders, Code, Sparkles, Eye, Accessibility, Settings, Info } from "lucide-react";

export default function SiriOrbDocPage() {
  const [size, setSize] = useState(192);
  const [animationDuration, setAnimationDuration] = useState(20);
  const [colorPreset, setColorPreset] = useState("default");

  const presets: Record<string, { bg: string; c1: string; c2: string; c3: string }> = {
    default: {
      bg: "oklch(95% 0.02 264.695)",
      c1: "oklch(75% 0.15 350)",
      c2: "oklch(80% 0.12 200)",
      c3: "oklch(78% 0.14 280)",
    },
    siri: {
      bg: "oklch(15% 0.05 260)",
      c1: "oklch(65% 0.3 340)",
      c2: "oklch(70% 0.25 200)",
      c3: "oklch(60% 0.35 280)",
    },
    emerald: {
      bg: "oklch(15% 0.03 140)",
      c1: "oklch(75% 0.25 140)",
      c2: "oklch(85% 0.18 160)",
      c3: "oklch(70% 0.2 180)",
    },
    warning: {
      bg: "oklch(15% 0.04 30)",
      c1: "oklch(65% 0.28 25)",
      c2: "oklch(75% 0.25 45)",
      c3: "oklch(60% 0.2 10)",
    },
  };

  const getCodeSnippet = () => {
    const colorStr =
      colorPreset === "default"
        ? ""
        : `\n  colors={{
    bg: "${presets[colorPreset].bg}",
    c1: "${presets[colorPreset].c1}",
    c2: "${presets[colorPreset].c2}",
    c3: "${presets[colorPreset].c3}"
  }}`;

    return `<SiriOrb
  size="${size}px"
  animationDuration={${animationDuration}}${colorStr}
/>`;
  };

  return (
    <div className="space-y-12 max-w-5xl scroll-smooth text-slate-300">
      {/* Intro */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#85AB8B]/10 border border-[#85AB8B]/20">
          <Sparkles className="w-4 h-4 text-[#85AB8B]" />
          <span className="text-xs font-bold text-[#85AB8B] uppercase tracking-wider">UI Component</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Siri Orb</h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          A gorgeous, highly performant, and premium animated Siri Orb component. Uses pure CSS Houdini Custom Properties to rotate multiple overlaid conic gradients, layered underneath a dynamic radial dot matrix mask.
        </p>
      </section>

      {/* Interactive Playground */}
      <section className="space-y-6 pt-6 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Eye className="w-5 h-5 text-[#85AB8B]" /> Interactive Playground
        </h2>
        <p className="text-sm text-slate-400">
          Tweak the settings below to preview the Siri Orb and copy the code for your React project.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {/* Preview Panel */}
          <div className="lg:col-span-7 flex items-center justify-center p-12 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-md min-h-[350px] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(133,171,139,0.05),transparent_60%)] pointer-events-none" />
            <div className="z-10 flex flex-col items-center">
              <SiriOrb
                size={`${size}px`}
                animationDuration={animationDuration}
                colors={presets[colorPreset]}
              />
              <span className="text-xs font-mono text-slate-500 mt-6 block">
                Preview ({size}x{size}px)
              </span>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="lg:col-span-5 p-8 rounded-3xl border border-white/5 bg-white/[0.01] space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-4.5 h-4.5 text-[#85AB8B]" /> Configuration
              </h3>

              {/* Size Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-400">
                  <span>Orb Size</span>
                  <span className="text-white font-mono">{size}px</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="300"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#85AB8B]"
                />
              </div>

              {/* Animation Speed Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-400">
                  <span>Rotation Duration</span>
                  <span className="text-white font-mono">{animationDuration}s</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  value={animationDuration}
                  onChange={(e) => setAnimationDuration(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#85AB8B]"
                />
              </div>

              {/* Color Presets */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Color Palette</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "default", label: "Pastel Sky" },
                    { id: "siri", label: "Neon Siri" },
                    { id: "emerald", label: "Teal Forest" },
                    { id: "warning", label: "Sunset Fire" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setColorPreset(p.id)}
                      className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                        colorPreset === p.id
                          ? "bg-[#85AB8B]/10 border-[#85AB8B]/40 text-white"
                          : "bg-white/5 border-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 text-xs text-slate-500 flex items-center gap-2">
              <Settings className="w-3.5 h-3.5" />
              <span>Glow adapts to the selected size dynamically.</span>
            </div>
          </div>
        </div>

        {/* Code Snippet */}
        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Code className="w-4 h-4 text-[#85AB8B]" /> Usage Example
            </span>
          </div>
          <pre className="p-5 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-emerald-400 select-all overflow-x-auto leading-relaxed">
            {getCodeSnippet()}
          </pre>
        </div>
      </section>

      {/* Features */}
      <section className="space-y-4 pt-6 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white tracking-tight">Features</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {[
            { title: "Animated Conic Gradients", desc: "Overlays 6 distinct, rotating conic gradients centered dynamically." },
            { title: "Translucent Dot Grid Overlay", desc: "Uses CSS mix-blend-mode: overlay to project a modern spherical dot-matrix." },
            { title: "Intelligent Responsive Blur", desc: "Scales filter blur and contrast ratios automatically based on dimensions." },
            { title: "Reduced Motion Fallback", desc: "Gracefully pauses rotation when prefers-reduced-motion is active." },
          ].map((f, i) => (
            <li key={i} className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-1">
              <span className="font-bold text-white block">{f.title}</span>
              <span className="text-slate-400 text-xs">{f.desc}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Accessibility */}
      <section className="space-y-4 pt-6 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Accessibility className="w-5 h-5 text-[#85AB8B]" /> Accessibility
        </h2>
        <div className="p-5 rounded-2xl border border-[#85AB8B]/20 bg-[#85AB8B]/5 flex gap-4 text-sm text-slate-300">
          <Info className="w-5 h-5 text-[#85AB8B] flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <span className="font-bold text-white block">Reduced Motion Optimization</span>
            <p className="leading-relaxed text-slate-400 text-xs">
              This component is purely decorative and does not contain semantic contents. It listens directly to the browser&apos;s media settings via `@media (prefers-reduced-motion: reduce)`. When triggered, it stops the rotating `@keyframes` animation and shows a static, beautiful color state.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
