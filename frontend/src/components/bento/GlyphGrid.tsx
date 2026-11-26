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
    <div className="h-full rounded-3xl dark:bg-[#141712] bg-[#fdfdfa] border dark:border-[#23271f] border-[#e6e4da] p-5 flex flex-col justify-between shadow-xs">
      <div className="flex items-center justify-between text-[11px] font-mono dark:text-[#6f6d64] text-[#9a978c] mb-2">
        <span className="uppercase tracking-wider font-semibold">Cryptographic Primitives</span>
        <span className="text-[#2e7d4f] dark:text-[#5fca8c] font-bold">12 Primitives</span>
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
                  ? "dark:bg-[#5fca8c]/10 bg-[#f2f7f0] border-[#2e7d4f] dark:border-[#5fca8c] scale-105"
                  : "dark:bg-[#12140f] bg-[#f6f5ef] dark:border-[#23271f] border-[#e6e4da] hover:border-[#d9d6ca] dark:hover:border-[#30352b]"
                }`}
            >
              <span
                className={`text-base font-bold transition-colors flex items-center justify-center h-5 ${isActive ? "text-[#2e7d4f] dark:text-[#5fca8c]" : "dark:text-[#ecebe4] text-[#1d1d1a]"
                  }`}
              >
                {g.symbol}
              </span>
              <span className="text-[8px] font-mono dark:text-[#6f6d64] text-[#9a978c] truncate max-w-[48px] mt-0.5">
                {g.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Active Glyph Info Footer */}
      <div className="mt-2 pt-2 border-t dark:border-[#23271f] border-[#e6e4da] text-[10px] font-mono flex items-center justify-between">
        <span className="dark:text-[#b2b0a6] text-[#5c5a53] truncate">
          {activeIdx !== null ? glyphs[activeIdx].desc : "Hover over primitive"}
        </span>
        <span className="text-[#2e7d4f] dark:text-[#5fca8c] font-bold">NIST/FIPS</span>
      </div>
    </div>
  );
};
