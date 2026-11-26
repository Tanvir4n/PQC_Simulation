"use client";

import React from "react";

interface WireframeGlobeProps {
  onInspectNetwork: () => void;
}

export const WireframeGlobe: React.FC<WireframeGlobeProps> = ({ onInspectNetwork }) => {
  const satelliteBody = (
    <g transform="rotate(-25)">
      {/* Center Satellite Cube */}
      <rect
        x="-6"
        y="-6"
        width="12"
        height="12"
        className="dark:fill-[#141712] fill-[#fdfdfa]"
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
  );

  return (
    <div
      onClick={onInspectNetwork}
      className="group cursor-pointer relative h-full min-h-[260px] rounded-3xl dark:bg-[#141712] bg-[#fdfdfa] border dark:border-[#23271f] border-[#e6e4da] hover:dark:border-[#30352b] hover:border-[#d9d6ca] transition-all p-5 flex flex-col justify-between overflow-hidden shadow-xs"
    >
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-radial from-[#00dc82]/5 via-transparent to-transparent pointer-events-none" />

      {/* Header Tag */}
      <div className="relative z-10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00dc82] animate-pulse" />
          <span className="text-[11px] font-mono dark:text-slate-400 text-slate-500 uppercase tracking-wider font-semibold">
            100-Node Simulated Network
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#00dc82] dark:bg-[#00dc82]/10 bg-emerald-50 px-2 py-0.5 rounded border border-[#00dc82]/20 font-bold">
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
            {/* Complete 360-degree closed orbit path for continuous satellite animateMotion */}
            <path
              id="orbitTrajectory"
              d="M 100.3 82.9 C 143.2 60.1, 186.8 58.2, 197.7 78.7 C 208.6 99.2, 182.6 134.3, 139.7 157.1 C 96.8 179.9, 53.2 181.8, 42.3 161.3 C 31.4 140.8, 57.4 105.7, 100.3 82.9 Z"
              fill="none"
            />
          </defs>

          {/* ============================================================ */}
          {/* LAYER 1: BACK / TOP ORBIT ARC (Rendered BEHIND Earth)        */}
          {/* Sweeps across the top from bottom-left (42.3, 161.3) through */}
          {/* the top (100.3, 82.9) to right side (197.7, 78.7).           */}
          {/* Because it is in Layer 1, the solid Earth body (Layer 2)     */}
          {/* naturally occludes the part that passes through the Earth!   */}
          {/* ============================================================ */}
          <path
            d="M 42.3 161.3 C 31.4 140.8, 57.4 105.7, 100.3 82.9 C 143.2 60.1, 186.8 58.2, 197.7 78.7"
            fill="none"
            stroke="#00dc82"
            strokeWidth="1.2"
            strokeDasharray="4 2"
            opacity="0.65"
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
          {/* LAYER 1.5: SATELLITE BEHIND EARTH (t in [0, 0.25) U [0.75,1])*/}
          {/* Earth solid body (Layer 2) naturally clips it pixel-by-pixel */}
          {/* as it slips behind the left limb and emerges from the right  */}
          {/* without any opacity fade-in/fade-out.                        */}
          {/* ============================================================ */}
          <g>
            <animateMotion
              dur="8s"
              repeatCount="indefinite"
              rotate="auto"
            >
              <mpath href="#orbitTrajectory" />
            </animateMotion>
            <animate
              attributeName="visibility"
              calcMode="discrete"
              values="visible; hidden; visible"
              keyTimes="0; 0.25; 0.75"
              dur="8s"
              repeatCount="indefinite"
            />
            {satelliteBody}
          </g>

          {/* ============================================================ */}
          {/* LAYER 2: EARTH SOLID BODY (Middle Occlusion Layer)           */}
          {/* Solid fill covers the back orbit arc & behind-Earth satellite*/}
          {/* ============================================================ */}
          <circle
            cx="120"
            cy="120"
            r="60"
            className="dark:fill-[#141712] fill-[#fdfdfa] dark:stroke-[#23271f] stroke-[#e6e4da]"
            strokeWidth="1.2"
          />

          {/* ============================================================ */}
          {/* LAYER 3: EARTH WIREFRAME & NODES (Latitudes & Longitudes)    */}
          {/* ============================================================ */}

          {/* Latitude ellipses */}
          <ellipse
            cx="120"
            cy="120"
            rx="60"
            ry="24"
            fill="none"
            className="dark:stroke-[#1e293b] stroke-slate-300"
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
            className="dark:stroke-[#1e293b] stroke-slate-300"
            strokeWidth="1"
          />

          {/* Longitude ellipses with 3D rotation animation */}
          <ellipse
            cx="120"
            cy="120"
            rx="24"
            ry="60"
            fill="none"
            className="dark:stroke-[#1e293b] stroke-slate-300"
            strokeWidth="1"
          >
            <animate
              attributeName="rx"
              values="0; 24; 48; 60; 48; 24; 0"
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
            className="dark:stroke-[#1e293b] stroke-slate-300"
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
          {/* LAYER 4: FRONT / BOTTOM ORBIT ARC (Rendered ON TOP of Earth) */}
          {/* Sweeps across front face from right (197.7, 78.7) through    */}
          {/* bottom (139.7, 157.1) to bottom-left (42.3, 161.3).          */}
          {/* This is the foreground arc that passes in front of Earth.    */}
          {/* ============================================================ */}
          <path
            d="M 197.7 78.7 C 208.6 99.2, 182.6 134.3, 139.7 157.1 C 96.8 179.9, 53.2 181.8, 42.3 161.3"
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
          {/* LAYER 5: SATELLITE IN FRONT OF EARTH (t in [0.25, 0.75))     */}
          {/* Discrete swap at outer open-space tips (r=88 > Earth r=60)   */}
          {/* ============================================================ */}
          <g>
            <animateMotion
              dur="8s"
              repeatCount="indefinite"
              rotate="auto"
            >
              <mpath href="#orbitTrajectory" />
            </animateMotion>
            <animate
              attributeName="visibility"
              calcMode="discrete"
              values="hidden; visible; hidden"
              keyTimes="0; 0.25; 0.75"
              dur="8s"
              repeatCount="indefinite"
            />
            {satelliteBody}
          </g>
        </svg>
      </div>

      {/* Footer Details */}
      <div className="relative z-10 flex items-center justify-between text-[11px] font-mono border-t dark:border-[#23271f] border-[#e6e4da] pt-2">
        <span className="dark:text-slate-400 text-slate-500">Classical / Hybrid / PQC</span>
        <span className="text-[#00dc82] group-hover:underline flex items-center gap-1 font-bold">
          <span>[Inspect 100 Nodes]</span>
          <span>→</span>
        </span>
      </div>
    </div>
  );
};
