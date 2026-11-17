"use client";

import React, { useState } from "react";

interface GlyphGridProps {
  onSelectGlyph?: (id: string) => void;
}

export const GlyphGrid: React.FC<GlyphGridProps> = ({ onSelectGlyph }) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const glyphs = [
    { id: "secp", label: "SECP256K1", symbol: "∿", desc: "Classical Elliptic Curve" },
    { id: "mldsa", label: "ML-DSA-65", symbol: "❖", desc: "NIST FIPS 204 Lattice" },
    { id: "sha3", label: "SHA3-512", symbol: "⎔", desc: "Canonical Digest Sponge" },
    { id: "and", label: "STRICT AND", symbol: "∧", desc: "Dual Verification Rule" },
    { id: "env", label: "3,380 B", symbol: "⧉", desc: "Hybrid Signature Envelope" },
    { id: "tps", label: "1,054 TPS", symbol: "⚡", desc: "Peak Tested Throughput" },
    { id: "mig", label: "P1 → P7", symbol: "⇄", desc: "7-Phase Migration Curve" },
    { id: "trough", label: "75.4%", symbol: "∐", desc: "P3 Parity Compatibility" },
    { id: "anvil", label: "ANVIL EVM", symbol: "⬡", desc: "Chain ID 31337 Layer" },
    { id: "gas", label: "240,028", symbol: "⨳", desc: "Deployment Gas Metric" },
    { id: "abl", label: "ABLATION", symbol: "⛨", desc: "6 Tested Attack Vectors" },
    { id: "pqc", label: "QUANTUM", symbol: "⟠", desc: "EUF-CMA_Q Reduction" },
  ];

  return (
    <div className="h-full rounded-2xl bg-[#0b0e14] border border-[#161d27] p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
        <span className="uppercase tracking-wider">Cryptographic Primitives</span>
        <span className="text-[#00dc82]">12 Primitives</span>
      </div>

      {/* 3x4 Glyph Grid */}
      <div className="grid grid-cols-4 gap-2 py-1">
        {glyphs.map((g, idx) => {
          const isActive = activeIdx === idx;
          return (
            <div
              key={g.id}
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseLeave={() => setActiveIdx(null)}
              onClick={() => onSelectGlyph?.(g.id)}
              className={`cursor-pointer rounded-xl h-14 flex flex-col items-center justify-center border transition-all ${
                isActive
                  ? "bg-[#00dc82]/10 border-[#00dc82] shadow-sm shadow-[#00dc82]/30 scale-105"
                  : "bg-[#080b0f] border-[#161d27] hover:border-[#263344]"
              }`}
            >
              <span
                className={`text-base font-bold transition-colors ${
                  isActive ? "text-[#00dc82]" : "text-slate-300"
                }`}
              >
                {g.symbol}
              </span>
              <span className="text-[8px] font-mono text-slate-500 truncate max-w-[48px] mt-0.5">
                {g.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Active Glyph Info Footer */}
      <div className="mt-2 pt-2 border-t border-[#161d27] text-[10px] font-mono flex items-center justify-between">
        <span className="text-slate-400 truncate">
          {activeIdx !== null ? glyphs[activeIdx].desc : "Hover over primitive"}
        </span>
        <span className="text-[#00dc82]">NIST/FIPS</span>
      </div>
    </div>
  );
};

