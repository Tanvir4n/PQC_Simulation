"use client";

import React from "react";

interface QuantumLogoProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

/**
 * High-definition QuantumResist Shield Logo
 * Faithful to research identity & FIPS 204 specification
 * Sleek, minimal, rounded vector geometry
 */
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
          ? "dark:drop-shadow-[0_0_10px_rgba(0,220,130,0.45)] drop-shadow-[0_1px_4px_rgba(5,150,105,0.2)]"
          : ""
      }`}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="qrShieldStroke" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00dc82" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="qrShieldFill" x1="16" y1="3" x2="16" y2="29" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00dc82" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="qrInnerLattice" x1="16" y1="8" x2="16" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00dc82" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Clean, rounded outer quantum security shield */}
        <path
          d="M16 3.5C21.5 5.8 25.5 6.2 26.5 6.5C27 9.5 27 16.5 24 21.5C21.5 25.5 17.5 28 16 28.5C14.5 28 10.5 25.5 8 21.5C5 16.5 5 9.5 5.5 6.5C6.5 6.2 10.5 5.8 16 3.5Z"
          fill="url(#qrShieldFill)"
          stroke="url(#qrShieldStroke)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Inner geometric core: Minimalist quantum lattice node */}
        <circle cx="16" cy="14" r="2.5" fill="url(#qrInnerLattice)" />
        {/* Symmetric quantum orbital lines */}
        <path
          d="M16 16.5V23.5"
          stroke="url(#qrInnerLattice)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M11 12.5C13 11 19 11 21 12.5"
          stroke="url(#qrInnerLattice)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>
    </div>
  );
};
