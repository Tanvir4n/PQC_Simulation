"use client";

import React, { useState } from "react";

interface GlyphItem {
  id: string;
  label: string;
  symbol: React.ReactNode;
  desc: string;
}

export const GlyphGrid: React.FC<{ onSelectGlyph?: (id: string) => void }> = ({ onSelectGlyph }) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const glyphs: GlyphItem[] = [
    { id: "secp", label: "SECP256K1", symbol: "∿", desc: "Classical Elliptic Curve" },
    { id: "mldsa", label: "ML-DSA-65", symbol: "❖", desc: "NIST FIPS 204 Lattice" },
    { id: "sha3", label: "SHA3-512", symbol: "⎔", desc: "Canonical Digest Sponge" },
    { id: "and", label: "STRICT AND", symbol: "∧", desc: "Dual Verification Rule" },
    { id: "env", label: "3,380 B", symbol: "⧉", desc: "Hybrid Signature Envelope" },
    {
      id: "tps",
      label: "1,054 TPS",
      symbol: (
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 fill-current inline-block translate-y-[-1px]"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
      desc: "Peak Tested Throughput",
    },
    { id: "mig", label: "P1 → P7", symbol: "⇄", desc: "7-Phase Migration Curve" },
    { id: "trough", label: "75.4%", symbol: "∐", desc: "P3 Parity Compatibility" },
    { id: "anvil", label: "ANVIL EVM", symbol: "⬡", desc: "Chain ID 31337 Layer" },
    { id: "gas", label: "240,028", symbol: "⨳", desc: "Deployment Gas Metric" },
    { id: "abl", label: "ABLATION", symbol: "⛨", desc: "6 Tested Attack Vectors" },
    { id: "pqc", label: "QUANTUM", symbol: "⟠", desc: "EUF-CMA_Q Reduction" },
  ];

  return (
    <div className="h-full rounded-2xl dark:bg-[#0b0e14] bg-white border dark:border-[#161d27] border-slate-200 p-4 flex flex-col justify-between shadow-md">
      <div className="flex items-center justify-between text-[11px] font-mono dark:text-slate-400 text-slate-500 mb-2">
        <span className="uppercase tracking-wider font-semibold">Cryptographic Primitives</span>
        <span className="text-[#00dc82] font-bold">12 Primitives</span>
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
              className={`cursor-pointer rounded-xl h-14 flex flex-col items-center justify-center border transition-all ${isActive
                  ? "dark:bg-[#00dc82]/10 bg-emerald-50 border-[#00dc82] shadow-sm shadow-[#00dc82]/30 scale-105"
                  : "dark:bg-[#080b0f] bg-slate-50 dark:border-[#161d27] border-slate-200 hover:border-slate-300 dark:hover:border-[#263344]"
                }`}
            >
              <span
                className={`text-base font-bold transition-colors flex items-center justify-center h-5 ${isActive ? "text-[#00dc82]" : "dark:text-slate-300 text-slate-700"
                  }`}
              >
                {g.symbol}
              </span>
              <span className="text-[8px] font-mono dark:text-slate-500 text-slate-500 truncate max-w-[48px] mt-0.5">
                {g.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Active Glyph Info Footer */}
      <div className="mt-2 pt-2 border-t dark:border-[#161d27] border-slate-100 text-[10px] font-mono flex items-center justify-between">
        <span className="dark:text-slate-400 text-slate-500 truncate">
          {activeIdx !== null ? glyphs[activeIdx].desc : "Hover over primitive"}
        </span>
        <span className="text-[#00dc82] font-bold">NIST/FIPS</span>
      </div>
    </div>
  );
};
