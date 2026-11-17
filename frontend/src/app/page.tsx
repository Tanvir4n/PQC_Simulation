"use client";

import React, { useState } from "react";
import { BentoHeader } from "@/components/bento/BentoHeader";
import { PillarAccordion } from "@/components/bento/PillarAccordion";
import { WireframeGlobe } from "@/components/bento/WireframeGlobe";
import { GlyphGrid } from "@/components/bento/GlyphGrid";
import { HexBadge } from "@/components/bento/HexBadge";
import { WireframeCubes } from "@/components/bento/WireframeCubes";
import { ModuleModal } from "@/components/bento/ModuleModal";
import { Shield, Sparkles, ArrowRight, Zap, ExternalLink, Terminal } from "lucide-react";

export default function Home() {
  const [isLiveMode, setIsLiveMode] = useState<boolean>(false);
  const [activeModalModule, setActiveModalModule] = useState<string | null>(null);

  return (
    <div className="min-h-screen dark:bg-[#030507] bg-[#f4f6f9] p-3 md:p-6 lg:p-8 flex flex-col gap-4 dark:text-slate-100 text-slate-900 max-w-[1600px] mx-auto select-none transition-colors duration-300">
      {/* 1. Top macOS-style Browser Header */}
      <BentoHeader
        isLiveMode={isLiveMode}
        setIsLiveMode={setIsLiveMode}
        onOpenQuickLab={() => setActiveModalModule("overview")}
      />

      {/* 2. Main Bento Grid (Inspired by Source / Vercel Dark & Day UI) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Interactive Pillar Navigator & Inspector (Span 4) */}
        <div className="lg:col-span-4 space-y-4">
          <PillarAccordion onOpenModule={(id) => setActiveModalModule(id)} />

          {/* Academic Affiliation Card */}
          <div className="rounded-2xl dark:bg-[#0b0e14] bg-white border dark:border-[#161d27] border-slate-200 p-4 flex items-center justify-between text-xs font-mono shadow-sm">
            <div>
              <div className="dark:text-slate-200 text-slate-900 font-bold">Md. Tanvir Hasan</div>
              <div className="text-[11px] dark:text-slate-500 text-slate-500">Dept. of Computer Science Engineering, DIU</div>
            </div>
            <a
              href="https://orcid.org/0009-0008-9130-3360"
              target="_blank"
              rel="noreferrer"
              className="text-[#00dc82] hover:underline flex items-center gap-1 text-[11px] font-bold"
            >
              <span>ORCID</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Right Bento Cards Section (Span 8) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Hero Branding Box */}
          <div className="rounded-2xl dark:bg-[#0b0e14] bg-white border dark:border-[#161d27] border-slate-200 p-6 flex flex-col justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl dark:bg-[#080c10] bg-emerald-50 border dark:border-[#00dc82]/30 border-[#00dc82]/40 flex items-center justify-center text-[#00dc82] shadow-lg shadow-[#00dc82]/10">
                <svg viewBox="0 0 40 40" className="w-7 h-7">
                  <path
                    d="M 10 14 C 10 8, 20 8, 24 14 C 28 20, 20 28, 14 32 C 10 35, 20 35, 26 31"
                    fill="none"
                    stroke="#00dc82"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                  <circle cx="28" cy="12" r="2.5" fill="#00dc82" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight dark:text-white text-slate-900 flex items-center gap-2">
                  <span>QuantumResist</span>
                </h1>
                <span className="text-[10px] font-mono dark:text-slate-500 text-slate-500 uppercase tracking-wider">
                  Hybrid Classical-Post-Quantum Platform
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t dark:border-[#161d27] border-slate-100 flex items-center justify-between text-xs font-mono dark:text-slate-400 text-slate-600">
              <span>ECDSA (secp256k1) + ML-DSA-65</span>
              <span className="text-[#00dc82] font-bold">SHA3-512</span>
            </div>
          </div>

          {/* Card 2: 3x4 Glowing Glyph Grid */}
          <GlyphGrid onSelectGlyph={(id) => {
            if (id === "mldsa" || id === "secp" || id === "env") setActiveModalModule("crypto");
            else if (id === "tps") setActiveModalModule("scalability");
            else if (id === "mig" || id === "trough") setActiveModalModule("migration");
            else if (id === "abl" || id === "and") setActiveModalModule("security");
            else if (id === "anvil" || id === "gas") setActiveModalModule("evm");
            else setActiveModalModule("overview");
          }} />

          {/* Card 3: Wireframe 3D Sphere & Orbiting Satellite */}
          <WireframeGlobe onInspectNetwork={() => setActiveModalModule("network")} />

          {/* Card 4: Hexagonal Badge & ASCII Art Box */}
          <HexBadge onInspectCrypto={() => setActiveModalModule("crypto")} />

          {/* Card 5: Big Bold Hero Statement & Vibrant Green Pill */}
          <div className="rounded-2xl dark:bg-[#0b0e14] bg-white border dark:border-[#161d27] border-slate-200 p-6 flex flex-col justify-between space-y-4 shadow-md">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono dark:text-slate-500 text-slate-500">
                <span>Security Assurance</span>
                <span className="text-[#00dc82] font-bold">[+]</span>
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold dark:text-white text-slate-900 leading-snug">
                Build <span className="text-[#00dc82]">quantum-resilient</span> blockchains that survive{" "}
                <span className="dark:text-white text-slate-900">Shor&apos;s algorithm</span>
              </h2>
              <div className="text-xs font-mono dark:text-slate-400 text-slate-600 pt-1">
                [Strict AND Verification · 1,054 Peak TPS · 3,380 B Envelope]
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveModalModule("overview")}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#00dc82] hover:bg-[#00c574] text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#00dc82]/20 hover:scale-[1.01]"
              >
                <span>Launch Interactive Simulation Lab</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 6: Wireframe Isometric 3D Cubes & Matrix Code */}
          <WireframeCubes onInspectBlocks={() => setActiveModalModule("mempool")} />
        </div>
      </div>

      {/* 3. Interactive Fullscreen Modal for Detailed Module Laboratory */}
      <ModuleModal
        moduleId={activeModalModule}
        onClose={() => setActiveModalModule(null)}
        isLiveMode={isLiveMode}
        onSelectModule={(id) => setActiveModalModule(id)}
      />
    </div>
  );
}
