"use client";

import React from "react";

interface WireframeGlobeProps {
  onInspectNetwork: () => void;
}

export const WireframeGlobe: React.FC<WireframeGlobeProps> = ({ onInspectNetwork }) => {
  // Orbit: tilted ellipse a=95, b=68, tilt=-25°, centered (120,120).
  // b=68 > Earth r=60 → orbit NEVER crosses the Earth body.
  // Split into Front arc (right side, ON TOP) and Back arc (left side, BEHIND).
  // No clipPath needed — pure SVG layer ordering.

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
          <defs>
            {/* Full closed orbit path for satellite animateMotion */}
            {/* Starts at t=270° (91.3, 58.4) = top-left of orbit */}
            <path
              id="orbitPath"
              d="M 91.3 58.4 C 138.9 36.2, 190.2 45.9, 206.1 79.9 C 222.0 113.9, 196.3 159.4, 148.7 181.6 C 101.1 203.8, 49.8 194.1, 33.9 160.1 C 18.0 126.1, 43.7 80.6, 91.3 58.4 Z"
              fill="none"
            />
          </defs>

          {/* ============================================================ */}
          {/* LAYER 1: Back orbit arc — BEHIND Earth (dim, faint)          */}
          {/* t=90° (148.7, 181.6) → t=180° → t=270° (91.3, 58.4)        */}
          {/* ============================================================ */}
          <path
            d="M 148.7 181.6 C 101.1 203.8, 49.8 194.1, 33.9 160.1 C 18.0 126.1, 43.7 80.6, 91.3 58.4"
            fill="none"
            stroke="#00dc82"
            strokeWidth="1.2"
            strokeDasharray="4 2"
            opacity="0.15"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-24"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>

          {/* ============================================================ */}
          {/* LAYER 2: Earth solid body (covers the behind orbit cleanly)  */}
          {/* ============================================================ */}
          <circle
            cx="120"
            cy="120"
            r="60"
            fill="#0b0e14"
            stroke="#1e293b"
            strokeWidth="1.2"
          >
            <animate
              attributeName="stroke"
              values="#1e293b;#2d3d54;#1e293b"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>

          {/* ============================================================ */}
          {/* LAYER 3: Earth wireframe (latitudes, longitudes, nodes)      */}
          {/* ============================================================ */}

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
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="24"
              dur="6s"
              repeatCount="indefinite"
            />
          </ellipse>
          <ellipse
            cx="120"
            cy="120"
            rx="60"
            ry="45"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1"
          />

          {/* Longitude ellipses with 3D rotation animation */}
          <ellipse
            cx="120"
            cy="120"
            rx="24"
            ry="60"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1"
          >
            <animate
              attributeName="rx"
              values="0; 24; 48; 60; 48; 24; 0"
              dur="9s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke"
              values="#1a2332;#2d3d54;#3b4f6b;#2d3d54;#1a2332"
              dur="9s"
              repeatCount="indefinite"
            />
          </ellipse>
          <ellipse
            cx="120"
            cy="120"
            rx="45"
            ry="60"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1"
            strokeDasharray="3 3"
          >
            <animate
              attributeName="rx"
              values="48; 60; 48; 24; 0; 24; 48"
              dur="9s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-24"
              dur="6s"
              repeatCount="indefinite"
            />
          </ellipse>

          {/* Beacon Green Nodes on Globe Surface */}
          {/* Node 1: Classical Green */}
          <circle cx="95" cy="110" r="3.5" fill="#00dc82">
            <animate attributeName="r" values="3.2; 4; 3.2" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="95" cy="110" r="3.5" fill="none" stroke="#00dc82" strokeWidth="1">
            <animate attributeName="r" values="3.5; 14" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8; 0" dur="2.4s" repeatCount="indefinite" />
          </circle>

          {/* Node 2: Hybrid Green */}
          <circle cx="145" cy="130" r="3.5" fill="#00dc82">
            <animate attributeName="r" values="3.2; 4; 3.2" dur="2.2s" begin="0.7s" repeatCount="indefinite" />
          </circle>
          <circle cx="145" cy="130" r="3.5" fill="none" stroke="#00dc82" strokeWidth="1">
            <animate attributeName="r" values="3.5; 14" dur="2.4s" begin="0.7s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8; 0" dur="2.4s" begin="0.7s" repeatCount="indefinite" />
          </circle>

          {/* Node 3: Cyan */}
          <circle cx="120" cy="80" r="2.5" fill="#38bdf8">
            <animate attributeName="r" values="2.2; 3.2; 2.2" dur="1.8s" begin="1.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="120" cy="80" r="2.5" fill="none" stroke="#38bdf8" strokeWidth="1">
            <animate attributeName="r" values="2.5; 11" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8; 0" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
          </circle>

          {/* Node 4: Purple */}
          <circle cx="125" cy="160" r="2.5" fill="#a855f7">
            <animate attributeName="r" values="2.2; 3.2; 2.2" dur="2s" begin="0.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="125" cy="160" r="2.5" fill="none" stroke="#a855f7" strokeWidth="1">
            <animate attributeName="r" values="2.5; 11" dur="2.4s" begin="0.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8; 0" dur="2.4s" begin="0.4s" repeatCount="indefinite" />
          </circle>

          {/* ============================================================ */}
          {/* LAYER 4: Front orbit arc — ON TOP of Earth (bright)          */}
          {/* t=270° (91.3, 58.4) → t=0° → t=90° (148.7, 181.6)          */}
          {/* ============================================================ */}
          <path
            d="M 91.3 58.4 C 138.9 36.2, 190.2 45.9, 206.1 79.9 C 222.0 113.9, 196.3 159.4, 148.7 181.6"
            fill="none"
            stroke="#00dc82"
            strokeWidth="1.2"
            strokeDasharray="4 2"
            opacity="0.85"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-24"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>

          {/* ============================================================ */}
          {/* LAYER 5: Satellite orbiting along the full path              */}
          {/* Path starts at t=270° (top-left). Front arc = first half,    */}
          {/* Back arc = second half. Satellite visible on front, hidden   */}
          {/* on back.                                                      */}
          {/* ============================================================ */}
          <g>
            <animateMotion
              dur="8s"
              repeatCount="indefinite"
              rotate="auto"
            >
              <mpath href="#orbitPath" />
            </animateMotion>

            {/* Opacity: visible on front arc (first ~50%), hidden on back (~50%) */}
            <animate
              attributeName="opacity"
              values="1; 1; 0; 0; 1"
              keyTimes="0; 0.48; 0.50; 0.98; 1"
              dur="8s"
              repeatCount="indefinite"
            />

            {/* Satellite Body */}
            <g transform="rotate(-25)">
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

              {/* Pulsing Center Transponder Dot */}
              <circle cx="0" cy="0" r="2" fill="#00dc82">
                <animate
                  attributeName="opacity"
                  values="1; 0.3; 1"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="r"
                  values="1.8; 2.5; 1.8"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
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
