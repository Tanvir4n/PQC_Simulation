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
        glow
          ? "dark:drop-shadow-[0_0_12px_rgba(0,220,130,0.5)] drop-shadow-[0_2px_8px_rgba(5,150,105,0.25)]"
          : ""
      }`}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Dual-spectrum Hybrid Gradient (Emerald to Cyan) for Dark Mode */}
          <linearGradient
            id="qrShieldGrad"
            x1="6"
            y1="4"
            x2="42"
            y2="44"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#00dc82" />
            <stop offset="55%" stopColor="#059669" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Precision Ring Gradient */}
          <linearGradient
            id="qrRingGrad"
            x1="14"
            y1="12"
            x2="34"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#00dc82" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Dynamic Tail Gradient */}
          <linearGradient
            id="qrTailGrad"
            x1="27"
            y1="25"
            x2="40"
            y2="38"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#00dc82" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          {/* Glow Filter for Quantum Core */}
          <filter id="qrSparkFilter" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="0.9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Outer Hexagonal Quantum Shield Silhouette */}
        <polygon
          points="24 4, 42 13, 42 31, 24 44, 6 31, 6 13"
          className="dark:fill-[#00dc82]/12 fill-emerald-500/10"
          stroke="url(#qrShieldGrad)"
          strokeWidth="2.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* 2. Precision Crystallographic Lattice Struts */}
        <line
          x1="24"
          y1="4"
          x2="24"
          y2="12.5"
          className="dark:stroke-[#00dc82] stroke-emerald-600"
          strokeWidth="1.2"
          strokeOpacity="0.45"
          strokeDasharray="1.5 1.5"
        />
        <line
          x1="6"
          y1="13"
          x2="15"
          y2="18"
          className="dark:stroke-[#00dc82] stroke-emerald-600"
          strokeWidth="1.2"
          strokeOpacity="0.45"
          strokeDasharray="1.5 1.5"
        />
        <line
          x1="6"
          y1="31"
          x2="15.5"
          y2="26.5"
          className="dark:stroke-[#00dc82] stroke-emerald-600"
          strokeWidth="1.2"
          strokeOpacity="0.45"
          strokeDasharray="1.5 1.5"
        />
        <line
          x1="42"
          y1="13"
          x2="33"
          y2="18"
          className="dark:stroke-[#00dc82] stroke-emerald-600"
          strokeWidth="1.2"
          strokeOpacity="0.45"
          strokeDasharray="1.5 1.5"
        />
        <line
          x1="24"
          y1="44"
          x2="24"
          y2="31.5"
          className="dark:stroke-[#00dc82] stroke-emerald-600"
          strokeWidth="1.2"
          strokeOpacity="0.45"
          strokeDasharray="1.5 1.5"
        />

        {/* 3. Bold Geometric Quantum 'Q' Resilient Ring */}
        <circle
          cx="24"
          cy="22"
          r="9.5"
          stroke="url(#qrRingGrad)"
          strokeWidth="3.2"
          className="dark:fill-[#070a0e]/80 fill-white/80"
        />

        {/* 4. High-Energy Dynamic 'Q' Laser Tail */}
        <path
          d="M 27.5 25.5 L 39 37"
          stroke="url(#qrTailGrad)"
          strokeWidth="3.8"
          strokeLinecap="round"
        />

        {/* 5. Electric Cyan Quantum Node at tail tip */}
        <circle
          cx="39"
          cy="37"
          r="2.4"
          className="dark:fill-[#38bdf8] fill-sky-500"
          filter="url(#qrSparkFilter)"
        />

        {/* 6. Central Radiant Quantum Nexus Spark (✦) */}
        <path
          d="M 24 17 Q 24 22 20 22 Q 24 22 24 27 Q 24 22 28 22 Q 24 22 24 17 Z"
          className="dark:fill-[#00dc82] fill-emerald-600"
          filter="url(#qrSparkFilter)"
        />
      </svg>
    </div>
  );
};