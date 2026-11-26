"use client";

import React from "react";
import { ArrowRight, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { BrandLockup } from "@/components/brand/QuantumLogo";

/**
 * Custom precision SVG mark for the Overview tab:
 * An asymmetric architectural bento grid mirroring the overview workspace.
 */
const OverviewMark: React.FC<{ active?: boolean }> = ({ active }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    className="w-4 h-4 shrink-0"
    aria-hidden="true"
  >
    {/* Left tall architectural pillar */}
    <rect
      x="2.75"
      y="3"
      width="5.75"
      height="14"
      rx="1.75"
      fill="currentColor"
      fillOpacity={active ? 0.18 : 0.08}
      stroke="currentColor"
      strokeWidth="1.55"
    />
    {/* Top-right hero card */}
    <rect
      x="10.75"
      y="3"
      width="6.5"
      height="6"
      rx="1.65"
      fill="currentColor"
      fillOpacity={active ? 0.95 : 0.65}
    />
    {/* Bottom-right module card */}
    <rect
      x="10.75"
      y="11"
      width="6.5"
      height="6"
      rx="1.65"
      stroke="currentColor"
      strokeWidth="1.55"
    />
  </svg>
);

/**
 * Custom precision SVG mark for the Simulation tab:
 * A segmented quantum orbital ring framing a crisp execution core.
 */
const SimulationMark: React.FC<{ active?: boolean }> = ({ active }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    className="w-4 h-4 shrink-0"
    aria-hidden="true"
  >
    {/* Segmented outer quantum orbital arcs */}
    <path
      d="M10 2.25A7.75 7.75 0 0 1 17.5 8.1"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      opacity={active ? 0.9 : 0.75}
    />
    <path
      d="M10 17.75A7.75 7.75 0 0 1 2.5 11.9"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      opacity={active ? 0.9 : 0.75}
    />
    {/* Orbital nodes */}
    <circle cx="17.2" cy="11.2" r="1.15" fill="currentColor" opacity={active ? 1 : 0.8} />
    <circle cx="2.8" cy="8.8" r="1.15" fill="currentColor" opacity={active ? 1 : 0.8} />
    {/* Crisp central execution play prism */}
    <path
      d="M8.1 6.75a.55.55 0 0 1 .84-.47l4.65 3.05a.55.55 0 0 1 0 .94l-4.65 3.05a.55.55 0 0 1-.84-.47V6.75Z"
      fill="currentColor"
    />
  </svg>
);

interface BentoHeaderProps {
  currentView: "overview" | "simulation";
  setCurrentView: (view: "overview" | "simulation") => void;
  onOpenQuickLab: () => void;
}

export const BentoHeader: React.FC<BentoHeaderProps> = ({
  currentView,
  setCurrentView,
  onOpenQuickLab,
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:px-4 rounded-2xl dark:bg-[#0b0e14] bg-white dark:border-[#161d27] border-slate-200 shadow-sm border transition-all">
      {/* Prominent Brand Identity (Clean, traffic dots removed) */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentView("overview")}
          aria-label="QuantumResist home"
          className="flex items-center px-2 py-1.5 -mx-1 rounded-2xl hover:bg-slate-100/70 dark:hover:bg-white/[0.03] transition-colors text-left"
        >
          <BrandLockup size="md" />
        </button>
      </div>

      {/* Right Controls: View Switcher (Overview vs Simulation), Day/Night, & Quick Launch */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Day / Night Theme Toggle — Fixed Rigid Size & Animated Icon/Label Transition */}
        <button
          type="button"
          onClick={(e) => toggleTheme(e)}
          aria-label={isDark ? "Switch to Day Mode" : "Switch to Night Mode"}
          title={isDark ? "Switch to Day Mode (Light Theme)" : "Switch to Night Mode (Dark Theme)"}
          className="relative flex items-center justify-center gap-2 w-[38px] sm:w-[92px] h-[38px] rounded-full dark:bg-[#07090d] bg-slate-100/90 hover:bg-slate-200/80 dark:hover:bg-[#141b24] dark:border-white/[0.08] border-slate-200/90 border text-xs font-mono transition-colors duration-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] shrink-0 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00dc82]/40 overflow-hidden select-none"
        >
          {/* Animated Sun / Moon Icon Stack */}
          <span className="relative w-4 h-4 shrink-0 flex items-center justify-center">
            <Sun
              className={`w-3.5 h-3.5 text-amber-400 absolute transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isDark
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 -rotate-90 scale-50"
                }`}
            />
            <Moon
              className={`w-3.5 h-3.5 text-indigo-600 absolute transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isDark
                ? "opacity-0 rotate-90 scale-50"
                : "opacity-100 rotate-0 scale-100"
                }`}
            />
          </span>

          {/* Fixed-Width Sliding Label */}
          <span className="hidden sm:inline-flex relative w-[36px] h-4 items-center overflow-hidden">
            <span
              className={`absolute inset-0 flex items-center text-[11px] font-medium text-slate-300 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isDark ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2.5"
                }`}
            >
              Day
            </span>
            <span
              className={`absolute inset-0 flex items-center text-[11px] font-medium text-slate-700 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isDark ? "opacity-0 translate-y-2.5" : "opacity-100 translate-y-0"
                }`}
            >
              Night
            </span>
          </span>
        </button>

        {/* Overview / Simulation Lab Switcher - Fixed Rigid Dimensions, Clean Hairline Finish */}
        <div className="relative flex items-center p-1 rounded-full dark:bg-[#07090d] bg-slate-100/90 dark:border-white/[0.08] border-slate-200/90 border shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] select-none w-[244px] h-[38px] shrink-0">
          {/* Animated Sliding Pill Highlight */}
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${currentView === "simulation"
              ? "left-[calc(50%+2px)] bg-gradient-to-b from-[#2be096] to-[#059669] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_2px_12px_-2px_rgba(0,220,130,0.5)]"
              : "left-1 dark:bg-[#141b24] bg-white border dark:border-white/[0.08] border-slate-200/80 shadow-xs"
              }`}
          />

          {/* Overview Button */}
          <button
            type="button"
            onClick={() => setCurrentView("overview")}
            className={`relative z-10 w-1/2 h-full rounded-full text-xs font-semibold transition-colors duration-200 flex items-center justify-center gap-1.5 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00dc82]/40 ${currentView === "overview"
              ? "dark:text-[#3ee6a0] text-emerald-700 font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
          >
            <OverviewMark active={currentView === "overview"} />
            <span>Overview</span>
          </button>

          {/* Simulation Lab Button */}
          <button
            type="button"
            onClick={() => setCurrentView("simulation")}
            className={`relative z-10 w-1/2 h-full rounded-full text-xs font-semibold transition-colors duration-200 flex items-center justify-center gap-1.5 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00dc82]/40 ${currentView === "simulation"
              ? "text-[#041f14] font-bold tracking-[-0.01em]"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
          >
            <SimulationMark active={currentView === "simulation"} />
            <span>Simulation</span>
          </button>
        </div>

        {/* Quick Lab CTA */}
        <button
          onClick={onOpenQuickLab}
          className="px-4 py-2 rounded-xl dark:bg-[#141b24] bg-slate-900 hover:bg-slate-800 dark:hover:bg-[#1a2330] border dark:border-[#222d3d] border-slate-800 text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <span>Quick Lab</span>
          <ArrowRight className="w-3.5 h-3.5 dark:text-[#00dc82] text-emerald-400" />
        </button>
      </div>
    </div>
  );
};
