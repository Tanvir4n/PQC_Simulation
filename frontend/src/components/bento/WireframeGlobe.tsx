"use client";

import React from "react";

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
          {/* ========================================================= */}
          {/* LAYER 1: BEHIND EARTH (Orbit Path & Orbiting Satellite)   */}
          {/* Placed first so the Earth body occludes it from the front */}
          {/* ========================================================= */}

          {/* Complete Orbiting Green Trajectory Line (Rendered behind Earth) */}
          <path
            id="orbitTrajectory"
            d="M 197.7 78.7 C 208.6 99.2, 182.6 134.3, 139.7 157.1 C 96.8 179.9, 53.2 181.8, 42.3 161.3 C 31.4 140.8, 57.4 105.7, 100.3 82.9 C 143.2 60.1, 186.8 58.2, 197.7 78.7 Z"
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

          {/* Satellite Object: Travels along orbit and goes BEHIND the Earth */}
          <g>
            <animateMotion
              dur="8s"
              repeatCount="indefinite"
              rotate="auto"
            >
              <mpath href="#orbitTrajectory" />
            </animateMotion>

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
              {/* Solar Panels (Left and Right Wings) */}
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

          {/* ========================================================= */}
          {/* LAYER 2: IN FRONT (Earth Body, Wireframe & Surface Nodes) */}
          {/* Solid fill="#0b0e14" cleanly covers satellite when behind */}
          {/* ========================================================= */}

          {/* Earth Body Base (Solid #0b0e14 covers the orbit behind it) */}
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

          {/* Beacon Green Nodes on Globe Surface with radar ripple wave animations */}
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
