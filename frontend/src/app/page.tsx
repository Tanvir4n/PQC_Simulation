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
import { ScrambleText } from "@/components/brand/ScrambleText";
import { SimulationSection } from "@/components/architecture/SimulationSection";
import { Play, ExternalLink, ShieldCheck } from "lucide-react";

export default function Home() {
  const [currentView, setCurrentView] = useState<"overview" | "simulation">("overview");
  const [activeModalModule, setActiveModalModule] = useState<string | null>(null);
  const [isLiveMode] = useState<boolean>(true);

  return (
    <div className="min-h-screen dark:bg-[#0f110e] bg-[#fbfaf6] py-3 sm:py-6 px-3 sm:px-6 flex flex-col justify-between gap-5 dark:text-[#ecebe4] text-[#1d1d1a] select-none transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-5">
        {/* 1. Unified Simulation-Style Floating Header */}
        <BentoHeader
          currentView={currentView}
          setCurrentView={setCurrentView}
          onOpenQuickLab={() => setActiveModalModule("pipeline")}
        />

        {/* 2. VIEW A: EXISTING BENTO GRID DESIGN (Styled in Simulation Warm Paper / Obsidian Palette) */}
        {currentView === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch animate-in fade-in duration-200">
            {/* Left Column: Interactive Pillar Navigator, Affiliation & Live Benchmark Module (Span 4) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <PillarAccordion onOpenModule={(id) => setActiveModalModule(id)} />

              {/* Academic Affiliation Card */}
              <div className="rounded-3xl dark:bg-[#141712] bg-[#fdfdfa] border dark:border-[#23271f] border-[#e6e4da] p-4 px-5 flex items-center justify-between text-xs font-mono shadow-xs">
                <div>
                  <div className="dark:text-[#ecebe4] text-[#1d1d1a] font-bold">Md. Tanvir Hasan</div>
                  <div className="text-[11px] dark:text-[#6f6d64] text-[#9a978c]">
                    Dept. of Computer Science Engineering, DIU
                  </div>
                </div>
                <a
                  href="https://orcid.org/0009-0008-9130-3360"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#2e7d4f] dark:text-[#5fca8c] hover:underline flex items-center gap-1 text-[11px] font-bold"
                >
                  <span>ORCID</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Paper Telemetry & EVM Benchmark Module (Fills Left Column Cleanly) */}
              <div
                onClick={() => setActiveModalModule("scalability")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setActiveModalModule("scalability")}
                className="group cursor-pointer flex-1 rounded-3xl dark:bg-[#141712] bg-[#fdfdfa] border dark:border-[#23271f] border-[#e6e4da] hover:dark:border-[#30352b] hover:border-[#d9d6ca] p-5 flex flex-col justify-between gap-4 shadow-xs transition-all"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#7cc046] dark:bg-[#5fca8c] animate-pulse" />
                    <span className="text-[11px] dark:text-[#6f6d64] text-[#9a978c] uppercase tracking-wider font-semibold">
                      Empirical Telemetry
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#2e7d4f] dark:text-[#5fca8c] bg-[#f2f7f0] dark:bg-[#5fca8c]/10 px-2 py-0.5 rounded border border-[#a9cfb2] dark:border-[#5fca8c]/25 font-bold">
                    1,000-Run Avg
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-2xl dark:bg-[#12140f] bg-[#f6f5ef] border dark:border-[#23271f] border-[#e6e4da] p-3">
                    <div className="text-[10px] font-mono dark:text-[#6f6d64] text-[#9a978c] uppercase">
                      Wire Envelope
                    </div>
                    <div className="text-base font-extrabold dark:text-[#ecebe4] text-[#1d1d1a] mt-0.5 font-mono">
                      3,380 B
                    </div>
                    <div className="text-[10px] font-mono text-[#2e7d4f] dark:text-[#5fca8c] mt-0.5">
                      1B + 70B + 3,309B
                    </div>
                  </div>

                  <div className="rounded-2xl dark:bg-[#12140f] bg-[#f6f5ef] border dark:border-[#23271f] border-[#e6e4da] p-3">
                    <div className="text-[10px] font-mono dark:text-[#6f6d64] text-[#9a978c] uppercase">
                      Peak Throughput
                    </div>
                    <div className="text-base font-extrabold dark:text-[#ecebe4] text-[#1d1d1a] mt-0.5 font-mono">
                      1,054 TPS
                    </div>
                    <div className="text-[10px] font-mono text-[#2e7d4f] dark:text-[#5fca8c] mt-0.5">
                      100-Node Mesh
                    </div>
                  </div>

                  <div className="rounded-2xl dark:bg-[#12140f] bg-[#f6f5ef] border dark:border-[#23271f] border-[#e6e4da] p-3">
                    <div className="text-[10px] font-mono dark:text-[#6f6d64] text-[#9a978c] uppercase">
                      EVM Auth Gas
                    </div>
                    <div className="text-base font-extrabold dark:text-[#ecebe4] text-[#1d1d1a] mt-0.5 font-mono">
                      70,442
                    </div>
                    <div className="text-[10px] font-mono text-[#a8701f] dark:text-[#e0a54c] mt-0.5">
                      HybridAuth.sol
                    </div>
                  </div>

                  <div className="rounded-2xl dark:bg-[#12140f] bg-[#f6f5ef] border dark:border-[#23271f] border-[#e6e4da] p-3">
                    <div className="text-[10px] font-mono dark:text-[#6f6d64] text-[#9a978c] uppercase">
                      Parity Trough
                    </div>
                    <div className="text-base font-extrabold dark:text-[#ecebe4] text-[#1d1d1a] mt-0.5 font-mono">
                      75.4%
                    </div>
                    <div className="text-[10px] font-mono dark:text-[#b2b0a6] text-[#5c5a53] mt-0.5">
                      Phase P3 Safety
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono border-t dark:border-[#23271f] border-[#e6e4da] pt-2.5">
                  <span className="dark:text-[#6f6d64] text-[#9a978c]">Table 3 · 9 · 11 · 12</span>
                  <span className="text-[#2e7d4f] dark:text-[#5fca8c] font-bold group-hover:underline">
                    [Inspect Benchmarks] →
                  </span>
                </div>
              </div>
            </div>

            {/* Right Bento Cards Section (Span 8) */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Big Bold Hero Statement & Signature Simulation Lime Pill */}
              <div className="rounded-3xl dark:bg-[#141712] bg-[#fdfdfa] border dark:border-[#23271f] border-[#e6e4da] p-6 flex flex-col justify-between space-y-4 shadow-xs relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono dark:text-[#6f6d64] text-[#9a978c]">
                    <span>Security Assurance</span>
                    <span className="text-[#2e7d4f] dark:text-[#5fca8c] font-bold">[+]</span>
                  </div>
                  <ScrambleText
                    as="h2"
                    durationMs={1250}
                    className="text-xl md:text-2xl font-extrabold dark:text-[#ecebe4] text-[#1d1d1a] leading-snug cursor-default"
                    segments={[
                      { text: "Build " },
                      {
                        text: "quantum-resilient",
                        className: "text-[#2e7d4f] dark:text-[#5fca8c]",
                      },
                      { text: " blockchains that survive " },
                      {
                        text: "Shor's algorithm",
                        className: "dark:text-[#ecebe4] text-[#1d1d1a]",
                      },
                    ]}
                  />
                  <div className="text-xs font-mono dark:text-[#b2b0a6] text-[#5c5a53] pt-1">
                    [Strict AND Verification · 1,054 Peak TPS · 3,380 B Envelope]
                  </div>
                </div>

                <div className="relative z-10 pt-2">
                  <button
                    onClick={() => setCurrentView("simulation")}
                    className="w-full py-3.5 px-6 rounded-full bg-[#96F34C] hover:bg-[#85e23b] text-[#141712] font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch Interactive Simulation Lab</span>
                  </button>
                </div>
              </div>

              {/* Card 2: 3x4 Glyph Grid */}
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

              {/* Card 5: Hero Branding & Protocol Specification Box (Interactive) */}
              <div
                onClick={() => setActiveModalModule("overview")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setActiveModalModule("overview")}
                className="group cursor-pointer rounded-3xl dark:bg-[#141712] bg-[#fdfdfa] border dark:border-[#23271f] border-[#e6e4da] hover:dark:border-[#30352b] hover:border-[#d9d6ca] p-5 flex flex-col justify-between gap-4 shadow-xs transition-all min-h-[260px]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <BrandMark size={44} />
                    <div>
                      <h1 className="text-xl font-extrabold tracking-tight dark:text-[#ecebe4] text-[#1d1d1a] flex items-center gap-2">
                        <span>QuantumResist</span>
                      </h1>
                      <span className="text-[10px] font-mono dark:text-[#6f6d64] text-[#9a978c] uppercase tracking-wider">
                        Hybrid Classical-Post-Quantum Platform
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#2e7d4f] dark:text-[#5fca8c] bg-[#f2f7f0] dark:bg-[#5fca8c]/10 px-2 py-0.5 rounded border border-[#a9cfb2] dark:border-[#5fca8c]/25 font-bold shrink-0">
                    v0x01
                  </span>
                </div>

                {/* Protocol Specification & Conjunction Formula */}
                <div className="space-y-2.5">
                  <div className="rounded-2xl dark:bg-[#12140f] bg-[#f6f5ef] border dark:border-[#23271f] border-[#e6e4da] p-3 font-mono text-[11px] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="dark:text-[#6f6d64] text-[#9a978c]">ADDRESS BINDING</span>
                      <span className="text-[#2e7d4f] dark:text-[#5fca8c] font-bold">SHA-256</span>
                    </div>
                    <div className="dark:text-[#ecebe4] text-[#1d1d1a] truncate">
                      Trunc₁₆₀(SHA-256(&quot;HYB-ADDR&quot; ‖ pk_e ‖ pk_pq))
                    </div>
                    <div className="pt-1.5 border-t dark:border-[#23271f] border-[#e6e4da] flex items-center justify-between">
                      <span className="dark:text-[#6f6d64] text-[#9a978c]">CONJUNCTION GATE</span>
                      <span className="dark:text-[#ecebe4] text-[#1d1d1a] font-bold">b_final = b_e ∧ b_pq</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded-full dark:bg-[#1c2019] bg-[#efeee7] dark:text-[#b2b0a6] text-[#5c5a53]">
                      NIST FIPS 204
                    </span>
                    <span className="px-2 py-0.5 rounded-full dark:bg-[#1c2019] bg-[#efeee7] dark:text-[#b2b0a6] text-[#5c5a53]">
                      RFC 6979
                    </span>
                    <span className="px-2 py-0.5 rounded-full dark:bg-[#1c2019] bg-[#efeee7] dark:text-[#b2b0a6] text-[#5c5a53]">
                      SHA3-512 Context
                    </span>
                  </div>
                </div>

                <div className="pt-2.5 border-t dark:border-[#23271f] border-[#e6e4da] flex items-center justify-between text-[11px] font-mono">
                  <span className="dark:text-[#b2b0a6] text-[#5c5a53]">ECDSA (secp256k1) + ML-DSA-65</span>
                  <span className="text-[#2e7d4f] dark:text-[#5fca8c] font-bold group-hover:underline">
                    [Inspect Overview] →
                  </span>
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
      </div>

      {/* 4. Interactive Fullscreen Modal for Detailed Module Laboratory */}
      <ModuleModal
        moduleId={activeModalModule}
        onClose={() => setActiveModalModule(null)}
        isLiveMode={isLiveMode}
        onSelectModule={(id) => setActiveModalModule(id)}
      />

      {/* 5. Footer with Academic Affiliation */}
      <footer className="w-full max-w-7xl mx-auto pt-4 border-t dark:border-[#23271f] border-[#e6e4da] flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#9a978c] dark:text-[#6f6d64] gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#2e7d4f] dark:text-[#5fca8c]" />
          <span>
            <strong className="dark:text-[#ecebe4] text-[#1d1d1a]">Md. Tanvir Hasan</strong> · Dept. of Computer Science Engineering, Daffodil International University
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://orcid.org/0009-0008-9130-3360"
            target="_blank"
            rel="noreferrer"
            className="text-[#2e7d4f] dark:text-[#5fca8c] hover:underline flex items-center gap-1 font-bold"
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
