"use client";

import React from "react";

interface HexBadgeProps {
  onInspectCrypto: () => void;
}

export const HexBadge: React.FC<HexBadgeProps> = ({ onInspectCrypto }) => {
  return (
    <div
      onClick={onInspectCrypto}
      className="group cursor-pointer rounded-2xl bg-[#0b0e14] border border-[#161d27] hover:border-[#263344] p-4 flex items-center justify-between gap-3 transition-all"
    >
      {/* Left ASCII Art Box */}
      <div className="p-3 rounded-xl bg-[#07090d] border border-[#141a24] font-mono text-[10px] leading-tight text-[#00dc82] select-none">
        <div>|\ \ / /|</div>
        <div>| \ V / |</div>
        <div>|  | |  |</div>
        <div>| / . \ |</div>
        <div>|/ / \ \|</div>
      </div>

      {/* Right Glowing Hexagonal Shield with 'H' (Hybrid Classical + PQC) */}
      <div className="relative flex-1 flex items-center justify-center">
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Hexagon SVG */}
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_12px_rgba(0,220,130,0.3)]">
            <polygon
              points="50 3, 90 25, 90 75, 50 97, 10 75, 10 25"
              fill="#080c10"
              stroke="#00dc82"
              strokeWidth="2.5"
            />
            {/* Inner Hexagon */}
            <polygon
              points="50 12, 82 30, 82 70, 50 88, 18 70, 18 30"
              fill="none"
              stroke="#00dc82"
              strokeWidth="1"
              opacity="0.4"
            />
            {/* Stylized 'H' for Hybrid */}
            <path
              d="M 38 32 L 38 68 M 62 32 L 62 68 M 38 50 L 62 50"
              fill="none"
              stroke="#00dc82"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

