"use client";

import React, { useState, useEffect } from "react";

interface WireframeCubesProps {
  onInspectBlocks: () => void;
}

export const WireframeCubes: React.FC<WireframeCubesProps> = ({ onInspectBlocks }) => {
  // Scanner cycles between 3 inspection targets matching the Source Network Dribbble animation:
  // 0: Upper-Right block structure
  // 1: Lower-Left isometric cube
  // 2: Center-Right block face
  const [scanStep, setScanStep] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setScanStep((prev) => (prev + 1) % 3);
    }, 3600);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Positions for the 84x84 green crosshair viewfinder box
  const scanPositions = [
    { x: 104, y: 16, label: "SHA3_TOP_ROOT" },
    { x: 16, y: 84, label: "LEAF_NODE_0x2A" },
    { x: 88, y: 72, label: "STATE_SPONGE" },
  ];

  // ASCII wireframe glyph streams matching each scan target
  const asciiPatterns = [
    // Pattern 0: Upper-Right Stepped Blocks
    [
      "))<))    )))<",
      "<)<         )<<)",
      " )<)          )<<",
      " )  )           <<<      <",
      "<<)<)             <<))     ))",
      " )  )              <)<<)<)  <<)",
      " )  )           )<)     ))<<   )<<)",
      " )  )       <<<            ))<",
      " )  )       )<             ))<)",
      " ) )<   )   <           <<     <",
      "<))    )     ))<  )<<          <",
      " )     )       )<<)           <<<)",
      " )     )    ))<    <))        <)<",
      "<))    )  )<<)        ) <)<)  <",
      "   <)<)<))            )       <",
      "   <<  )              )       <",
      "<<)    )              )       <",
      " <     )   )<         )       <",
    ],
    // Pattern 1: Lower-Left Isometric Cube
    [
      "        <<)",
      "      <)  <)",
      "     <)     <)",
      "    <<)      <<)",
      "     ) )      ) )",
      "     )  )      )  )",
      "     )   )<     )   )<",
      "    <<)    <)  <<)    <)",
      "      <)     <)  <)     <)",
      "       <)      <) <)      <)",
      "        )       )  )       )",
      "        )       )  )       )",
      "        )       )  )       )",
      "        )       )  )       )",
      "        <<)     )  <<)     )",
      "          <)   <)    <)   <)",
      "            <)<)       <)<)",
    ],
    // Pattern 2: Center-Right Block & Sponge Face
    [
      "       <))        )<<)",
      "      <)<)        <)<)",
      "        <))      )<<",
      "         <))    )<<",
      "     <<    <<  <<<",
      "   ))<)       <)",
      "    )))       )     <))",
      "    )))       )    <)  <)",
      "   <))        )   <)    <)",
      "              )  <)      <)",
      "   <<         )<)        )",
      "  <))))       )          )",
      "    )         )          )",
      "    )         )          )",
      "    ))        )    <)    <)",
      "     <<       )      <)<)",
      "       )      )        )",
      "        <)<)<)",
    ],
  ];

  const currentPos = scanPositions[scanStep];

  return (
    <div
      onClick={onInspectBlocks}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="group cursor-pointer relative rounded-3xl dark:bg-[#141712] bg-[#fdfdfa] border dark:border-[#23271f] border-[#e6e4da] hover:dark:border-[#30352b] hover:border-[#d9d6ca] p-5 flex flex-col justify-between overflow-hidden transition-all min-h-[260px] shadow-xs"
    >
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-radial from-[#00dc82]/5 via-transparent to-transparent pointer-events-none" />

      {/* Top Header Tag */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00dc82] animate-pulse" />
          <span className="text-[11px] dark:text-slate-400 text-slate-500 uppercase tracking-wider font-semibold">
            SHA3-512 Block Architecture
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#00dc82] dark:bg-[#00dc82]/10 bg-emerald-50 px-2 py-0.5 rounded border border-[#00dc82]/20 font-bold">
          Merkle Engine
        </span>
      </div>

      {/* Center 3D Isometric Architecture + Reticle Scanner */}
      <div className="relative z-10 flex-1 flex items-center justify-center py-2">
        <svg
          viewBox="0 0 240 210"
          className="w-full h-44 group-hover:scale-105 transition-transform duration-500 overflow-visible"
        >
          <defs>
            {/* Halftone dot pattern for isometric shading */}
            <pattern id="halftoneGreen" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#00dc82" opacity="0.6">
                <animate
                  attributeName="opacity"
                  values="0.3;0.8;0.3"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </circle>
            </pattern>

            {/* Glowing filter for scanner crosshairs */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ============================================================ */}
          {/* 1. EXTENDED ISOMETRIC AXIS GUIDELINES (Dotted traveling lines)*/}
          {/* ============================================================ */}
          <g stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3">
            {/* Top-right axis */}
            <line x1="168" y1="94" x2="230" y2="58">
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-24"
                dur="4s"
                repeatCount="indefinite"
              />
            </line>
            {/* Top-left axis */}
            <line x1="88" y1="48" x2="40" y2="20">
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="24"
                dur="4s"
                repeatCount="indefinite"
              />
            </line>
            {/* Bottom vertical axis */}
            <line x1="126" y1="184" x2="126" y2="206">
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-24"
                dur="4s"
                repeatCount="indefinite"
              />
            </line>
            {/* Far bottom-right axis */}
            <line x1="198" y1="148" x2="236" y2="170">
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-24"
                dur="4s"
                repeatCount="indefinite"
              />
            </line>
          </g>

          {/* ============================================================ */}
          {/* 2. ISOMETRIC ARCHITECTURE (3D Wireframe Blocks & Slabs)       */}
          {/* ============================================================ */}

          {/* Block A: Tall Tower/Slab (Top-Left) */}
          <g>
            {/* Top Diamond Face */}
            <polygon
              points="106 20, 134 36, 106 52, 78 36"
              fill="#080c12"
              stroke="#64748b"
              strokeWidth="1.2"
            />
            {/* Left Vertical Face */}
            <polygon
              points="78 36, 106 52, 106 102, 78 86"
              fill="#0b0e14"
              stroke="#64748b"
              strokeWidth="1.2"
            />
            {/* Right Vertical Face (With Halftone Dots) */}
            <polygon
              points="106 52, 134 36, 134 86, 106 102"
              fill="#0a0f18"
              stroke="#64748b"
              strokeWidth="1.2"
            />
            <polygon
              points="106 52, 134 36, 134 86, 106 102"
              fill="url(#halftoneGreen)"
              opacity="0.45"
            />
          </g>

          {/* Block B: Stepped Middle Connector (Center-Top) */}
          <g>
            {/* Stepped Top Face */}
            <polygon
              points="106 102, 168 66, 196 82, 134 118"
              fill="#080c12"
              stroke="#94a3b8"
              strokeWidth="1.2"
            />
            {/* Stepped Right Face */}
            <polygon
              points="168 66, 196 82, 196 128, 168 112"
              fill="#0a0f18"
              stroke="#64748b"
              strokeWidth="1.2"
            />
            {/* Halftone matrix on middle shaded step */}
            <polygon
              points="106 102, 134 118, 134 154, 106 138"
              fill="#0b0e14"
              stroke="#64748b"
              strokeWidth="1.2"
            />
            <polygon
              points="106 102, 134 118, 134 154, 106 138"
              fill="url(#halftoneGreen)"
              opacity="0.75"
            />
          </g>

          {/* Block C: Right Isometric Block (Upper-Right) */}
          <g>
            {/* Top Face */}
            <polygon
              points="168 112, 196 128, 168 144, 140 128"
              fill="#080c12"
              stroke="#94a3b8"
              strokeWidth="1.2"
            />
            {/* Right Face (With vibrant Halftone) */}
            <polygon
              points="168 144, 196 128, 196 168, 168 184"
              fill="#0a0f18"
              stroke="#64748b"
              strokeWidth="1.2"
            />
            <polygon
              points="168 144, 196 128, 196 168, 168 184"
              fill="url(#halftoneGreen)"
              opacity="0.6"
            />
            {/* Left Face */}
            <polygon
              points="140 128, 168 144, 168 184, 140 168"
              fill="#0b0e14"
              stroke="#64748b"
              strokeWidth="1.2"
            />
          </g>

          {/* Block D: Lower-Left Isometric Cube (Foreground) */}
          <g>
            {/* Top Diamond Face */}
            <polygon
              points="66 112, 94 128, 66 144, 38 128"
              fill="#080c12"
              stroke="#cbd5e1"
              strokeWidth="1.2"
            />
            {/* Left Vertical Face */}
            <polygon
              points="38 128, 66 144, 66 184, 38 168"
              fill="#0a0e14"
              stroke="#94a3b8"
              strokeWidth="1.2"
            />
            {/* Right Vertical Face (With Halftone) */}
            <polygon
              points="66 144, 94 128, 94 168, 66 184"
              fill="#080c12"
              stroke="#cbd5e1"
              strokeWidth="1.2"
            />
            <polygon
              points="66 144, 94 128, 94 168, 66 184"
              fill="url(#halftoneGreen)"
              opacity="0.5"
            />
          </g>

          {/* Inner isometric depth guidelines */}
          <line x1="66" y1="184" x2="106" y2="204" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="106" y1="204" x2="140" y2="184" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="106" y1="138" x2="106" y2="204" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />

          {/* ============================================================ */}
          {/* 3. DYNAMIC VIEWFINDER SCANNER (Translates & Scans Targets)   */}
          {/* ============================================================ */}
          <g
            style={{
              transform: `translate(${currentPos.x}px, ${currentPos.y}px)`,
              transition: "transform 0.85s cubic-bezier(0.34, 1.3, 0.64, 1)",
            }}
          >
            {/* Green Transparent Viewfinder Window */}
            <rect
              x="0"
              y="0"
              width="84"
              height="84"
              fill="#00dc82"
              fillOpacity="0.06"
              stroke="#00dc82"
              strokeWidth="1"
              strokeOpacity="0.85"
            />

            {/* Corner Crosshairs (+) extending past corners */}
            {/* Top-Left */}
            <line x1="-5" y1="0" x2="5" y2="0" stroke="#00dc82" strokeWidth="1.4" filter="url(#neonGlow)" />
            <line x1="0" y1="-5" x2="0" y2="5" stroke="#00dc82" strokeWidth="1.4" filter="url(#neonGlow)" />
            {/* Top-Right */}
            <line x1="79" y1="0" x2="89" y2="0" stroke="#00dc82" strokeWidth="1.4" filter="url(#neonGlow)" />
            <line x1="84" y1="-5" x2="84" y2="5" stroke="#00dc82" strokeWidth="1.4" filter="url(#neonGlow)" />
            {/* Bottom-Left */}
            <line x1="-5" y1="84" x2="5" y2="84" stroke="#00dc82" strokeWidth="1.4" filter="url(#neonGlow)" />
            <line x1="0" y1="79" x2="0" y2="89" stroke="#00dc82" strokeWidth="1.4" filter="url(#neonGlow)" />
            {/* Bottom-Right */}
            <line x1="79" y1="84" x2="89" y2="84" stroke="#00dc82" strokeWidth="1.4" filter="url(#neonGlow)" />
            <line x1="84" y1="79" x2="84" y2="89" stroke="#00dc82" strokeWidth="1.4" filter="url(#neonGlow)" />

            {/* Subtle Horizontal Scanline sweeping inside viewfinder */}
            <line x1="1" y1="0" x2="83" y2="0" stroke="#00dc82" strokeWidth="1" opacity="0.4">
              <animate
                attributeName="y1"
                values="2;82;2"
                dur="2.8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="y2"
                values="2;82;2"
                dur="2.8s"
                repeatCount="indefinite"
              />
            </line>

            {/* Small active target metadata pill */}
            <text
              x="5"
              y="-7"
              fill="#00dc82"
              fontSize="5.5"
              fontFamily="monospace"
              fontWeight="bold"
              letterSpacing="0.5"
              opacity="0.9"
            >
              [SCAN: {currentPos.label}]
            </text>

            {/* ============================================================ */}
            {/* 4. ASCII GLYPH STREAM OVERLAY (Matches Underneath Geometry)   */}
            {/* ============================================================ */}
            {asciiPatterns.map((pattern, pIdx) => (
              <g
                key={pIdx}
                style={{
                  opacity: scanStep === pIdx ? 1 : 0,
                  transition: "opacity 0.45s ease-in-out",
                  pointerEvents: "none",
                }}
              >
                {pattern.map((line, lIdx) => (
                  <text
                    key={lIdx}
                    x="5"
                    y={10 + lIdx * 4.3}
                    fill="#00dc82"
                    fontSize="4.8"
                    fontFamily="monospace"
                    letterSpacing="0.4"
                    opacity={lIdx % 2 === 0 ? 0.95 : 0.75}
                  >
                    {line}
                  </text>
                ))}
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* Footer Commitments Tag */}
      <div className="relative z-10 flex items-center justify-between text-[11px] font-mono border-t dark:border-[#161d27] border-slate-100 pt-2">
        <span className="dark:text-slate-400 text-slate-500">Merkle Tree Commitments</span>
        <span className="text-[#00dc82] group-hover:underline flex items-center gap-1 font-bold">
          <span>[Inspect Blocks]</span>
          <span>→</span>
        </span>
      </div>
    </div>
  );
};
