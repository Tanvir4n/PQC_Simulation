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
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl dark:bg-[#0b0e14] bg-white dark:border-[#161d27] border-slate-200 shadow-sm border transition-all">
      {/* macOS Style Traffic Dots + Active Tab Pill */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 pl-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>

        {/* Tab Pill */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl dark:bg-[#121721] bg-slate-100 dark:border-[#1e2736] border-slate-200 border text-xs font-semibold dark:text-white text-slate-800">
          <div className="w-4 h-4 rounded dark:bg-[#00dc82]/20 bg-emerald-500/20 dark:border-[#00dc82]/40 border-emerald-500/40 border flex items-center justify-center dark:text-[#00dc82] text-emerald-600">
            <Shield className="w-2.5 h-2.5" />
          </div>
          <span>QuantumResist</span>
          <span className="text-[10px] dark:text-[#00dc82] text-emerald-600 font-mono px-1 py-0.2 rounded dark:bg-[#00dc82]/10 bg-emerald-500/10">
            FIPS 204
          </span>
        </div>
      </div>

      {/* Right Controls: Mode Switcher, Day/Night Toggle, & Quick Launch */}
      <div className="flex items-center gap-2">
        {/* Day / Night Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to Day Mode (Light Theme)" : "Switch to Night Mode (Dark Theme)"}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl dark:bg-[#07090d] bg-slate-100 hover:bg-slate-200 dark:hover:bg-[#141b24] dark:border-[#161d27] border-slate-200 border text-xs font-mono transition-all"
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

        {/* Reference / Live Lab Mode Switcher */}
        <div className="flex items-center gap-1 p-0.5 rounded-xl dark:bg-[#07090d] bg-slate-100 dark:border-[#161d27] border-slate-200 border">
          <button
            onClick={() => setIsLiveMode(false)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              !isLiveMode
                ? "dark:bg-[#141b24] bg-white dark:text-[#00dc82] text-emerald-600 border dark:border-[#1f2937] border-slate-200 shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Reference</span>
          </button>
          <button
            onClick={() => setIsLiveMode(true)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              isLiveMode
                ? "dark:bg-[#00dc82] bg-emerald-600 text-black dark:text-black text-white font-bold shadow-md dark:shadow-[#00dc82]/20 shadow-emerald-600/20"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Live Lab</span>
          </button>
        </div>

        {/* Quick Lab CTA */}
        <button
          onClick={onOpenQuickLab}
          className="px-3.5 py-1.5 rounded-xl dark:bg-[#141b24] bg-slate-900 hover:bg-slate-800 dark:hover:bg-[#1a2330] border dark:border-[#222d3d] border-slate-800 text-xs font-semibold text-white flex items-center gap-1.5 transition-all shadow-xs"
        >
          <span>Quick Lab</span>
          <ArrowRight className="w-3 h-3 dark:text-[#00dc82] text-emerald-400" />
        </button>
      </div>
    </div>
  );
};
