"use client";

import React from "react";
import { Shield, Sparkles, BookOpen, ArrowRight, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme";

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
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:px-4 rounded-2xl dark:bg-[#0b0e14] bg-white dark:border-[#161d27] border-slate-200 shadow-sm border transition-all">
      {/* macOS Style Traffic Dots + Prominent Brand Heading */}
      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-1.5 pl-1">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-xs" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-xs" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f] shadow-xs" />
        </div>

        {/* Large Prominent Brand Heading Pill */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl dark:bg-[#121721] bg-slate-100 dark:border-[#1e2736] border-slate-200 border shadow-xs transition-all">
          <div className="w-7 h-7 rounded-xl dark:bg-[#00dc82]/15 bg-emerald-500/15 dark:border-[#00dc82]/30 border-emerald-500/30 border flex items-center justify-center dark:text-[#00dc82] text-emerald-600 shadow-sm">
            <Shield className="w-4 h-4" />
          </div>
          <span className="text-base sm:text-lg font-extrabold tracking-tight dark:text-white text-slate-900">
            QuantumResist
          </span>
          <span className="text-[11px] dark:text-[#00dc82] text-emerald-700 font-mono font-bold px-2 py-0.5 rounded-md dark:bg-[#00dc82]/10 bg-emerald-100/80 border dark:border-[#00dc82]/25 border-emerald-300 uppercase tracking-wide">
            FIPS 204
          </span>
        </div>
      </div>

      {/* Right Controls: Mode Switcher, Day/Night Toggle, & Quick Launch */}
      <div className="flex items-center gap-2.5">
        {/* Day / Night Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to Day Mode (Light Theme)" : "Switch to Night Mode (Dark Theme)"}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl dark:bg-[#07090d] bg-slate-100 hover:bg-slate-200 dark:hover:bg-[#141b24] dark:border-[#161d27] border-slate-200 border text-xs font-mono transition-all shadow-xs"
        >
          {isDark ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline text-[11px] text-slate-400 font-medium">Day</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline text-[11px] text-slate-600 font-medium">Night</span>
            </>
          )}
        </button>

        {/* Reference / Live Lab Mode Switcher with Fluid Spring Slider Transition */}
        <div className="relative flex items-center p-1 rounded-2xl dark:bg-[#07090d] bg-slate-100 dark:border-[#161d27] border-slate-200 border shadow-inner select-none">
          {/* Animated Sliding Pill Highlight */}
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isLiveMode
                ? "left-[calc(50%+2px)] bg-gradient-to-r from-[#00dc82] to-[#059669] shadow-[0_0_20px_rgba(0,220,130,0.45)]"
                : "left-1 dark:bg-[#141b24] bg-white border dark:border-[#1f2937] border-slate-200 shadow-sm"
            }`}
          />

          {/* Reference Button */}
          <button
            onClick={() => setIsLiveMode(false)}
            className={`relative z-10 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 min-w-[100px] ${
              !isLiveMode
                ? "dark:text-[#00dc82] text-emerald-700 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <BookOpen
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                !isLiveMode ? "scale-110 dark:text-[#00dc82] text-emerald-600" : ""
              }`}
            />
            <span>Reference</span>
            {!isLiveMode && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#00dc82] animate-pulse" />
            )}
          </button>

          {/* Live Lab Button */}
          <button
            onClick={() => setIsLiveMode(true)}
            className={`relative z-10 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 min-w-[100px] ${
              isLiveMode
                ? "text-slate-950 font-extrabold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sparkles
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                isLiveMode ? "scale-110 text-slate-950" : ""
              }`}
            />
            <span>Live Lab</span>
            {isLiveMode && (
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
            )}
          </button>
        </div>

        {/* Quick Lab CTA */}
        <button
          onClick={onOpenQuickLab}
          className="px-4 py-2 rounded-xl dark:bg-[#141b24] bg-slate-900 hover:bg-slate-800 dark:hover:bg-[#1a2330] border dark:border-[#222d3d] border-slate-800 text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Quick Lab</span>
          <ArrowRight className="w-3.5 h-3.5 dark:text-[#00dc82] text-emerald-400" />
        </button>
      </div>
    </div>
  );
};
