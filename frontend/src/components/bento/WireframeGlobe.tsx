"use client";

import React from "react";
import { Radio } from "lucide-react";

interface WireframeGlobeProps {
  onInspectNetwork: () => void;
}

export const WireframeGlobe: React.FC<WireframeGlobeProps> = ({ onInspectNetwork }) => {
  return (
    <div
      onClick={onInspectNetwork}
      className="group cursor-pointer relative h-full min-h-[260px] rounded-2xl bg-[#0b0e14] border border-[#161d27] hover:border-[#263344] transition-all p-5 flex flex-col justify-between overflow-hidden"
    >
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-radial from-[#00dc82]/5 via-transparent to-transparent pointer-events-none" />

      {/* Header Tag */}
      <div className="relative z-10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00dc82] animate-pulse" />
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            100-Node Simulated Network
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#00dc82] bg-[#00dc82]/10 px-2 py-0.5 rounded border border-[#00dc82]/20">
          Mesh Topology
        </span>
      </div>

      {/* Central Wireframe Globe + Orbiting Satellite */}
      <div className="relative z-10 flex-1 flex items-center justify-center py-4">
        <svg
          viewBox="0 0 240 240"
          className="w-48 h-48 group-hover:scale-105 transition-transform duration-500"
        >
          {/* Outer circle */}
          <circle
            cx="120"
            cy="120"
            r="60"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1.2"
          />

          {/* Latitude ellipses */}
          <ellipse
            cx="120"
            cy="120"
            rx="60"
            ry="24"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <ellipse
            cx="120"
            cy="120"
            rx="60"
            ry="45"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1"
          />

          {/* Longitude ellipses */}
          <ellipse
            cx="120"
            cy="120"
            rx="24"
            ry="60"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1"
          />
          <ellipse
            cx="120"
            cy="120"
            rx="45"
            ry="60"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* Orbiting Green Trajectory Line */}
          <path
            d="M 60 70 A 90 60 0 1 1 180 170"
            fill="none"
            stroke="#00dc82"
            strokeWidth="1.2"
            strokeDasharray="4 2"
            opacity="0.8"
          />

          {/* Beacon Green Nodes on Globe Surface */}
          <circle cx="95" cy="110" r="3.5" fill="#00dc82" className="animate-pulse" />
          <circle cx="145" cy="130" r="3.5" fill="#00dc82" />
          <circle cx="120" cy="80" r="2.5" fill="#38bdf8" />
          <circle cx="125" cy="160" r="2.5" fill="#a855f7" />

          {/* Satellite Object on Orbit */}
          <g transform="translate(180, 70) rotate(-25)">
            {/* Center Satellite Cube */}
            <rect
              x="-6"
              y="-6"
              width="12"
              height="12"
              fill="#0b0e14"
              stroke="#00dc82"
              strokeWidth="1.2"
            />
            {/* Solar Panels */}
            <line x1="-16" y1="0" x2="-6" y2="0" stroke="#00dc82" strokeWidth="2" />
            <line x1="6" y1="0" x2="16" y2="0" stroke="#00dc82" strokeWidth="2" />
            <circle cx="0" cy="0" r="2" fill="#00dc82" />
          </g>
        </svg>
      </div>

      {/* Footer Details */}
      <div className="relative z-10 flex items-center justify-between text-[11px] font-mono border-t border-[#161d27] pt-2">
        <span className="text-slate-400">Classical / Hybrid / PQC</span>
        <span className="text-[#00dc82] group-hover:underline flex items-center gap-1">
          <span>[Inspect 100 Nodes]</span>
          <span>→</span>
        </span>
      </div>
    </div>
  );
};

