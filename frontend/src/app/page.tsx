"use client";

import React, { useState } from "react";
import { BentoHeader } from "@/components/bento/BentoHeader";
import { PillarAccordion } from "@/components/bento/PillarAccordion";
import { WireframeGlobe } from "@/components/bento/WireframeGlobe";
import { GlyphGrid } from "@/components/bento/GlyphGrid";
import { HexBadge } from "@/components/bento/HexBadge";
import { WireframeCubes } from "@/components/bento/WireframeCubes";
import { ModuleModal } from "@/components/bento/ModuleModal";
import { BrandMark } from "@/components/brand/QuantumLogo";
import { SimulationSection } from "@/components/architecture/SimulationSection";
import { Shield, Sparkles, ArrowRight, Zap, ExternalLink, ShieldCheck } from "lucide-react";

export default function Home() {
  const [currentView, setCurrentView] = useState<"overview" | "simulation">("overview");
  const [activeModalModule, setActiveModalModule] = useState<string | null>(null);
  const [isLiveMode, setIsLiveMode] = useState<boolean>(true);

  return (
    <div className="min-h-screen dark:bg-[#030507] bg-[#f4f6f9] p-3 md:p-6 lg:p-8 flex flex-col gap-4 dark:text-slate-100 text-slate-900 max-w-[1600px] w-full mx-auto select-none transition-colors duration-300">
      {/* 1. Top Unified Header (Dots removed, view switcher, Day/Night toggle, Quick Lab) */}
      <BentoHeader
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenQuickLab={() => setActiveModalModule("pipeline")}
      />

      {/* 2. VIEW A: FRONT PAGE (Exact Original Bento Grid Layout) */}
      {currentView === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start animate-in fade-in duration-200">
          {/* Left Column: Interactive Pillar Navigator & Inspector (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <PillarAccordion onOpenModule={(id) => setActiveModalModule(id)} />

            {/* Academic Affiliation Card */}
            <div className="rounded-2xl dark:bg-[#0b0e14] bg-white border dark:border-[#161d27] border-slate-200 p-4 flex items-center justify-between text-xs font-mono shadow-sm">
              <div>
                <div className="dark:text-slate-200 text-slate-900 font-bold">Md. Tanvir Hasan</div>
                <div className="text-[11px] dark:text-slate-500 text-slate-500">
                  Dept. of Computer Science Engineering, DIU
                </div>
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
            {/* Card 1: Big Bold Hero Statement & Vibrant Green Pill */}
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
                {/* Clicking switches directly to the dedicated Simulation Section! */}
                <button
                  onClick={() => setCurrentView("simulation")}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#00dc82] hover:bg-[#00c574] text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#00dc82]/20 hover:scale-[1.01]"
                >
                  <span>Launch Interactive Simulation Lab</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 2: 3x4 Glowing Glyph Grid */}
            <GlyphGrid
              onSelectGlyph={(id) => {
                if (id === "mldsa" || id === "secp" || id === "env") setActiveModalModule("crypto");
                else if (id === "tps") setActiveModalModule("scalability");
                else if (id === "mig" || id === "trough") setActiveModalModule("migration");
                else if (id === "abl" || id === "and") setActiveModalModule("security");
                else if (id === "anvil" || id === "gas") setActiveModalModule("evm");
                else setActiveModalModule("overview");
              }}
            />

            {/* Card 3: Wireframe 3D Sphere & Orbiting Satellite */}
            <WireframeGlobe onInspectNetwork={() => setActiveModalModule("network")} />

            {/* Card 4: Hexagonal Badge & ASCII Art Box */}
            <HexBadge onInspectCrypto={() => setActiveModalModule("crypto")} />

            {/* Card 5: Hero Branding Box */}
            <div className="rounded-2xl dark:bg-[#0b0e14] bg-white border dark:border-[#161d27] border-slate-200 p-6 flex flex-col justify-between shadow-md">
              <div className="flex items-center gap-3">
                <BrandMark size={48} />
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

            {/* Card 6: Wireframe Isometric 3D Cubes & Matrix Code */}
            <WireframeCubes onInspectBlocks={() => setActiveModalModule("mempool")} />
          </div>
        </div>
      )}

      {/* 3. VIEW B: DEDICATED PQC ARCHITECTURE & SIMULATION SECTION */}
      {currentView === "simulation" && (
        <div className="w-full animate-in fade-in duration-200">
          <SimulationSection
            onBackToOverview={() => setCurrentView("overview")}
            isLiveMode={isLiveMode}
          />
        </div>
      )}

      {/* 4. Interactive Fullscreen Modal for Detailed Module Laboratory */}
      <ModuleModal
        moduleId={activeModalModule}
        onClose={() => setActiveModalModule(null)}
        isLiveMode={isLiveMode}
        onSelectModule={(id) => setActiveModalModule(id)}
      />

      {/* 5. Footer with Academic Affiliation */}
      <footer className="w-full pt-4 border-t dark:border-[#161d27] border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#00dc82]" />
          <span>
            <strong className="dark:text-white text-slate-900">Md. Tanvir Hasan</strong> · Dept. of Computer Science Engineering, Daffodil International University
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://orcid.org/0009-0008-9130-3360"
            target="_blank"
            rel="noreferrer"
            className="text-[#00dc82] hover:underline flex items-center gap-1 font-bold"
          >
            <span>ORCID: 0009-0008-9130-3360</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span>NIST FIPS 204 · RFC 6979</span>
        </div>
      </footer>
    </div>
  );
}
