"use client";

import React from "react";

interface QuantumLogoProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

export const QuantumLogo: React.FC<QuantumLogoProps> = ({
  size = 28,
  className = "",
  glow = true,
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center shrink-0 ${className} ${
        glow ? "drop-shadow-[0_0_12px_rgba(0,220,130,0.35)]" : ""
      }`}
    >
      <svg
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Neon Emerald to Electric Cyan Gradient */}
          <linearGradient id="qrShieldBorder" x1="6" y1="3" x2="38" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00dc82" />
            <stop offset="60%" stopColor="#059669" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          {/* Left Facet Gradient (Classical secp256k1) */}
          <linearGradient id="qrFacetLeft" x1="6" y1="3" x2="22" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00dc82" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.04" />
          </linearGradient>

          {/* Right Facet Gradient (Post-Quantum ML-DSA-65) */}
          <linearGradient id="qrFacetRight" x1="22" y1="3" x2="38" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#00dc82" stopOpacity="0.08" />
          </linearGradient>

          {/* Core Glow Filter */}
          <filter id="coreGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Left Facet (Classical Cryptography Wing) */}
        <path
          d="M22 3.5L7 9V22.5C7 31.8 13.5 39.2 22 41.5V3.5Z"
          fill="url(#qrFacetLeft)"
          stroke="url(#qrShieldBorder)"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* 2. Right Facet (Post-Quantum Lattice Wing) */}
        <path
          d="M22 3.5L37 9V22.5C37 31.8 30.5 39.2 22 41.5V3.5Z"
          fill="url(#qrFacetRight)"
          stroke="url(#qrShieldBorder)"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* 3. Center Facet Seam / Dual-Key Suture Line */}
        <line
          x1="22"
          y1="4"
          x2="22"
          y2="41"
          stroke="#00dc82"
          strokeWidth="1.2"
          strokeOpacity="0.4"
        />

        {/* 4. Outer Dashed Quantum Orbit (Lattice Orbital Track) */}
        <circle
          cx="22"
          cy="20.5"
          r="10.5"
          stroke="#00dc82"
          strokeWidth="0.8"
          strokeDasharray="2.5 2.5"
          strokeOpacity="0.45"
        />

        {/* 5. Quantum 'Q' Central Resilient Ring */}
        <circle
          cx="22"
          cy="20.5"
          r="6.8"
          className="dark:stroke-white stroke-slate-900 dark:fill-[#080c10] fill-white"
          strokeWidth="2.4"
        />

        {/* 6. Central Quantum Nexus Spark (Lattice Diamond Core) */}
        <polygon
          points="22 17, 24.8 20.5, 22 24, 19.2 20.5"
          fill="#00dc82"
          filter="url(#coreGlow)"
        />

        {/* 7. Quantum 'Q' Dynamic Laser Tail (Cutting through Classical / Quantum plane) */}
        <path
          d="M26.5 25L34 33"
          stroke="#00dc82"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* 8. Quantum Entanglement Terminal Particle */}
        <circle
          cx="34"
          cy="33"
          r="1.8"
          fill="#38bdf8"
        />
      </svg>
    </div>
  );
};
