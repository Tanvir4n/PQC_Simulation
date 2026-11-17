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
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className} ${
        glow ? "drop-shadow-[0_0_14px_rgba(0,220,130,0.4)]" : ""
      }`}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Neon Emerald to Electric Cyan Gradient */}
          <linearGradient id="qrShieldGrad" x1="4" y1="3" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00dc82" />
            <stop offset="55%" stopColor="#059669" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          {/* Core Spark Radial Glow */}
          <filter id="qrSparkGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Outer Hexagonal Quantum Shield */}
        <polygon
          points="24 3, 43 11.5, 43 27.5, 24 43.5, 5 27.5, 5 11.5"
          className="dark:fill-[#00dc82]/12 fill-emerald-500/10"
          stroke="url(#qrShieldGrad)"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />

        {/* 2. Precision Crystalline Lattice Facet Lines (Geometric Depth) */}
        <path
          d="M24 3 L24 20 M43 11.5 L24 20 M5 11.5 L24 20 M24 20 L24 43.5 M43 27.5 L24 20 M5 27.5 L24 20"
          stroke="#00dc82"
          strokeWidth="0.8"
          strokeOpacity="0.35"
          strokeDasharray="2.5 2.5"
        />

        {/* 3. Bold Geometric Quantum 'Q' Resilient Ring */}
        <circle
          cx="24"
          cy="19.5"
          r="8"
          className="dark:stroke-white stroke-slate-900 dark:fill-[#070a0e] fill-white"
          strokeWidth="3.2"
        />

        {/* 4. Central Radiant Quantum Nexus Spark (✦) */}
        <polygon
          points="24 15, 27.5 19.5, 24 24, 20.5 19.5"
          fill="#00dc82"
          filter="url(#qrSparkGlow)"
        />

        {/* 5. Dynamic High-Energy 'Q' Laser Tail (Breaks out of the shield) */}
        <path
          d="M29.5 24.5 L39.5 36.5"
          stroke="#00dc82"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* 6. Electric Cyan Quantum Node */}
        <circle
          cx="39.5"
          cy="36.5"
          r="2.2"
          fill="#38bdf8"
        />
      </svg>
    </div>
  );
};
