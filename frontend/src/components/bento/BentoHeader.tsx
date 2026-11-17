"use client";

import React from "react";
import { Shield, Sparkles, BookOpen, ExternalLink, ArrowRight } from "lucide-react";

interface BentoHeaderProps {
  isLiveMode: boolean;
  setIsLiveMode: (live: boolean) => void;
  onOpenQuickLab: () => void;
}

export const BentoHeader: React.FC<BentoHeaderProps> = ({
  isLiveMode,
  setIsLiveMode,
  onOpenQuickLab,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#0b0e14] border border-[#161d27]">
      {/* macOS Style Traffic Dots + Active Tab Pill */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 pl-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>

        {/* Tab Pill */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[#121721] border border-[#1e2736] text-xs font-semibold text-white">
          <div className="w-4 h-4 rounded bg-[#00dc82]/20 border border-[#00dc82]/40 flex items-center justify-center text-[#00dc82]">
            <Shield className="w-2.5 h-2.5" />
          </div>
          <span>QuantumResist</span>
          <span className="text-[10px] text-[#00dc82] font-mono px-1 py-0.2 rounded bg-[#00dc82]/10">
            FIPS 204
          </span>
        </div>

        {/* URL Address Bar */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-[#07090d] border border-[#141a24] text-[11px] font-mono text-slate-500 max-w-xs truncate">
          <span>https://quantumresist.diu.edu.bd/research-simulator</span>
        </div>
      </div>

      {/* Mode Switcher & Quick Launch */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-[#07090d] border border-[#161d27]">
          <button
            onClick={() => setIsLiveMode(false)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              !isLiveMode
                ? "bg-[#141b24] text-[#00dc82] border border-[#1f2937]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Reference</span>
          </button>
          <button
            onClick={() => setIsLiveMode(true)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              isLiveMode
                ? "bg-[#00dc82] text-black font-bold shadow-md shadow-[#00dc82]/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Live Lab</span>
          </button>
        </div>

        <button
          onClick={onOpenQuickLab}
          className="px-3 py-1.5 rounded-xl bg-[#141b24] hover:bg-[#1a2330] border border-[#222d3d] text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all"
        >
          <span>Quick Lab</span>
          <ArrowRight className="w-3 h-3 text-[#00dc82]" />
        </button>
      </div>
    </div>
  );
};

