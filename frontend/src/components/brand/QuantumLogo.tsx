"use client";

import React, { useId } from "react";

interface QuantumLogoProps {
  size?: number;
  className?: string;
  glow?: boolean;
  /** Mark colour. Defaults to the brand emerald. */
  color?: string;
}

/**
 * QuantumResist mark.
 * A shield split down the middle: the left half is solid (classical ECDSA),
 * the right half is a lattice (post-quantum ML-DSA). Both halves make one shield,
 * the same way both signatures make one valid transaction.
 */
export const QuantumLogo: React.FC<QuantumLogoProps> = ({
  size = 28,
  className = "",
  glow = false,
  color = "#3ee6a0",
}) => {
  const uid = useId().replace(/:/g, "");
  const shield =
    "M16 3.2 26 6.6V15c0 6.2-4 10.9-10 13.8C10 25.9 6 21.2 6 15V6.6Z";
  const lattice: [number, number][] = [];
  for (const y of [9.5, 13.5, 17.5, 21.5]) for (const x of [18.6, 22.2]) lattice.push([x, y]);

  return (
    <span
      style={{ width: size, height: size, filter: glow ? `drop-shadow(0 0 8px ${color}55)` : undefined }}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
    >
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full" aria-hidden>
        <defs>
          <clipPath id={`l-${uid}`}>
            <rect x="0" y="0" width="16" height="32" />
          </clipPath>
          <clipPath id={`s-${uid}`}>
            <path d={shield} />
          </clipPath>
        </defs>

        {/* Classical half: solid */}
        <g clipPath={`url(#s-${uid})`}>
          <rect x="0" y="0" width="16" height="32" fill={color} clipPath={`url(#l-${uid})`} />
          {/* Post-quantum half: lattice */}
          {lattice.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.15" fill={color} />
          ))}
        </g>

        {/* Shield outline */}
        <path d={shield} stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </span>
  );
};

/** The mark on its ink tile, used in headers and cards. */
export const BrandMark: React.FC<{ size?: number; className?: string }> = ({ size = 34, className = "" }) => (
  <span
    style={{ width: size, height: size, borderRadius: size * 0.32 }}
    className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden
      bg-[linear-gradient(160deg,#16231d_0%,#0a120e_100%)]
      shadow-[inset_0_1px_0_rgba(255,255,255,0.09),inset_0_0_0_1px_rgba(62,230,160,0.18),0_1px_2px_rgba(0,0,0,0.25),0_6px_16px_-6px_rgba(10,60,40,0.45)]
      ${className}`}
  >
    <QuantumLogo size={Math.round(size * 0.66)} />
  </span>
);

interface BrandLockupProps {
  size?: "sm" | "md";
  subtitle?: string;
}

/** Mark + wordmark + standard tag. */
export const BrandLockup: React.FC<BrandLockupProps> = ({ size = "md", subtitle }) => {
  const md = size === "md";
  return (
    <span className="inline-flex items-center gap-3">
      <BrandMark size={md ? 34 : 30} />
      <span className="flex flex-col leading-none">
        <span className="flex items-center gap-2.5">
          <span
            className={`${md ? "text-[18px]" : "text-[15px]"} tracking-[-0.025em] dark:text-white text-[#0d1512]`}
          >
            <span className="font-bold">Quantum</span>
            <span className="font-normal dark:text-white/70 text-[#0d1512]/65">Resist</span>
          </span>
          <span className="h-3.5 w-px dark:bg-white/15 bg-black/12" aria-hidden />
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] uppercase dark:text-white/55 text-[#0d1512]/55">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3ee6a0] shadow-[0_0_0_2px_rgba(62,230,160,0.18)]" aria-hidden />
            FIPS 204
          </span>
        </span>
        {subtitle && (
          <span className="mt-1.5 font-mono text-[10px] tracking-[0.06em] dark:text-white/40 text-[#0d1512]/45 hidden sm:block">
            {subtitle}
          </span>
        )}
      </span>
    </span>
  );
};
