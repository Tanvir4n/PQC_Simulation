"use client";

import React from "react";

interface HexBadgeProps {
  onInspectCrypto: () => void;
}

export const HexBadge: React.FC<HexBadgeProps> = ({ onInspectCrypto }) => {
  return (
    <div
      onClick={onInspectCrypto}
      className="group cursor-pointer relative h-full min-h-[260px] rounded-3xl dark:bg-[#141712] bg-[#fdfdfa] border dark:border-[#23271f] border-[#e6e4da] hover:dark:border-[#30352b] hover:border-[#d9d6ca] p-5 flex flex-col justify-between overflow-hidden transition-all shadow-xs"
    >
      {/* Ambient radial background glow */}
      <div className="absolute inset-0 bg-radial from-[#00dc82]/5 via-transparent to-transparent pointer-events-none" />

      {/* Header Tag matching other bento cards */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00dc82] animate-pulse" />
          <span className="text-[11px] dark:text-slate-400 text-slate-500 uppercase tracking-wider font-semibold">
            Hybrid Dual-Key Engine
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#00dc82] dark:bg-[#00dc82]/10 bg-emerald-50 px-2 py-0.5 rounded border border-[#00dc82]/20 font-bold">
          Strict AND Rule
        </span>
      </div>

      {/* Central Visual: Monogram ASCII Fingerprint + Glowing Quantum Shield */}
      <div className="relative z-10 flex-1 flex items-center justify-center gap-6 py-4">
        {/* Left ASCII Monogram Art Box */}
        <div className="p-3.5 rounded-xl dark:bg-[#0f110e] bg-[#f6f5ef] border dark:border-[#23271f] border-[#e6e4da] font-mono text-[11px] leading-tight text-[#00dc82] select-none shadow-inner group-hover:border-[#00dc82]/40 transition-colors">
          <div className="opacity-90 hover:opacity-100 transition-opacity">|\ \ / /|</div>
          <div className="opacity-90 hover:opacity-100 transition-opacity">| \ V / |</div>
          <div className="opacity-70 text-[#00dc82]/70">|  | |  |</div>
          <div className="opacity-90 hover:opacity-100 transition-opacity">| / . \ |</div>
          <div className="opacity-90 hover:opacity-100 transition-opacity">|/ / \ \|</div>
        </div>

        {/* Right Glowing Hexagonal Shield with 'H' (Hybrid Classical + PQC) */}
        <div className="relative w-24 h-24 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_16px_rgba(0,220,130,0.35)]">
            <defs>
              <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00dc82" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Rotating dashed outer ring */}
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#00dc82"
              strokeWidth="0.8"
              strokeDasharray="4 6"
              opacity="0.3"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="20s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Outer Hexagon Shield */}
            <polygon
              points="50 4, 89 25, 89 75, 50 96, 11 75, 11 25"
              className="dark:fill-[#080c10] fill-white"
              stroke="url(#hexGrad)"
              strokeWidth="2.4"
            >
              <animate
                attributeName="stroke-width"
                values="2.4; 3.0; 2.4"
                dur="3s"
                repeatCount="indefinite"
              />
            </polygon>

            {/* Inner Hexagon Outline */}
            <polygon
              points="50 14, 81 31, 81 69, 50 86, 19 69, 19 31"
              fill="none"
              stroke="#00dc82"
              strokeWidth="1"
              opacity="0.4"
              strokeDasharray="2 3"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="24"
                dur="8s"
                repeatCount="indefinite"
              />
            </polygon>

            {/* Stylized 'H' for Hybrid (secp256k1 + ML-DSA-65) */}
            <path
              d="M 38 33 L 38 67 M 62 33 L 62 67 M 38 50 L 62 50"
              fill="none"
              stroke="#00dc82"
              strokeWidth="3.6"
              strokeLinecap="round"
            >
              <animate
                attributeName="opacity"
                values="0.85; 1; 0.85"
                dur="2s"
                repeatCount="indefinite"
              />
            </path>

            {/* Center Quantum Security Dot */}
            <circle cx="50" cy="50" r="2.2" fill="#00dc82">
              <animate
                attributeName="r"
                values="2; 3; 2"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6; 1; 0.6"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      </div>

      {/* Footer Tag matching other bento cards */}
      <div className="relative z-10 flex items-center justify-between text-[11px] font-mono border-t dark:border-[#23271f] border-[#e6e4da] pt-2">
        <span className="dark:text-slate-400 text-slate-500">ECDSA secp256k1 + ML-DSA-65</span>
        <span className="text-[#00dc82] group-hover:underline flex items-center gap-1 font-bold">
          <span>[Inspect Hybrid Auth]</span>
          <span>→</span>
        </span>
      </div>
    </div>
  );
};
