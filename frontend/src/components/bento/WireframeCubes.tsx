"use client";

import React from "react";

interface WireframeCubesProps {
  onInspectBlocks: () => void;
}

export const WireframeCubes: React.FC<WireframeCubesProps> = ({ onInspectBlocks }) => {
  return (
    <div
      onClick={onInspectBlocks}
      className="group cursor-pointer relative rounded-2xl bg-[#0b0e14] border border-[#161d27] hover:border-[#263344] p-5 flex flex-col justify-between overflow-hidden transition-all min-h-[220px]"
    >
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400 uppercase tracking-wider text-[11px]">
          SHA3-512 Block Architecture
        </span>
        <span className="text-[#00dc82]">[+]</span>
      </div>

      {/* Isometric Wireframe Cubes & Matrix Overlay SVG */}
      <div className="relative flex items-center justify-center py-2">
        <svg viewBox="0 0 200 160" className="w-44 h-36">
          {/* Isometric Cube 1 */}
          <g transform="translate(60, 40)" stroke="#334155" strokeWidth="1" fill="none">
            {/* Top face */}
            <polygon points="40 0, 80 20, 40 40, 0 20" />
            {/* Left face */}
            <polygon points="0 20, 40 40, 40 80, 0 60" />
            {/* Right face */}
            <polygon points="40 40, 80 20, 80 60, 40 80" />
          </g>

          {/* Isometric Cube 2 (Shifted down right) */}
          <g transform="translate(90, 65)" stroke="#00dc82" strokeWidth="1.2" fill="none">
            <polygon points="40 0, 80 20, 40 40, 0 20" />
            <polygon points="0 20, 40 40, 40 80, 0 60" opacity="0.6" />
            <polygon points="40 40, 80 20, 80 60, 40 80" opacity="0.8" />
          </g>

          {/* Green Matrix / Crosshair Overlay */}
          <rect
            x="30"
            y="25"
            width="90"
            height="90"
            fill="none"
            stroke="#00dc82"
            strokeWidth="0.8"
            strokeDasharray="4 4"
            opacity="0.5"
          />
          {/* Crosshair markers */}
          <line x1="25" y1="25" x2="35" y2="25" stroke="#00dc82" strokeWidth="1" />
          <line x1="30" y1="20" x2="30" y2="30" stroke="#00dc82" strokeWidth="1" />
          <line x1="115" y1="115" x2="125" y2="115" stroke="#00dc82" strokeWidth="1" />
          <line x1="120" y1="110" x2="120" y2="120" stroke="#00dc82" strokeWidth="1" />

          {/* Digital code characters */}
          <text x="35" y="45" fill="#00dc82" fontSize="6" fontFamily="monospace" opacity="0.7">
            0x3046022100d8a9
          </text>
          <text x="35" y="55" fill="#00dc82" fontSize="6" fontFamily="monospace" opacity="0.7">
            SHA3-512::ROOT::0x1f
          </text>
          <text x="35" y="65" fill="#00dc82" fontSize="6" fontFamily="monospace" opacity="0.7">
            NONCE::00240028
          </text>
          <text x="35" y="75" fill="#00dc82" fontSize="6" fontFamily="monospace" opacity="0.7">
            STRICT_AND=TRUE
          </text>
        </svg>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono border-t border-[#161d27] pt-2">
        <span className="text-slate-500">Merkle Tree Commitments</span>
        <span className="text-[#00dc82] group-hover:underline">[&gt;&gt;]</span>
      </div>
    </div>
  );
};
