"use client";

import React from "react";
import { Play, RotateCcw, Sun, Moon, Sparkles, Layers, Maximize2, Shield } from "lucide-react";
import { BrandLockup } from "@/components/brand/QuantumLogo";
import { useTheme } from "@/lib/theme";

export type ActiveNavTab =
  | "architecture"
  | "workflow"
  | "cryptography"
  | "blockchain"
  | "security"
  | "migration"
  | "evm";

interface AgentShieldHeaderProps {
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  isRunning: boolean;
  onRunSimulation: () => void;
  onReset: () => void;
  onTogglePresentation: () => void;
  isPresentationMode: boolean;
}

export const AgentShieldHeader: React.FC<AgentShieldHeaderProps> = ({
  activeTab,
  setActiveTab,
  isRunning,
  onRunSimulation,
  onReset,
  onTogglePresentation,
  isPresentationMode
}) => {
  const { isDark, toggleTheme } = useTheme();

  const navItems: { id: ActiveNavTab; label: string }[] = [
    { id: "architecture", label: "Architecture" },
    { id: "workflow", label: "Workflow" },
    { id: "cryptography", label: "Cryptography" },
    { id: "blockchain", label: "Blockchain" },
    { id: "security", label: "Security" },
    { id: "migration", label: "Migration" },
    { id: "evm", label: "EVM Integration" }
  ];

  return (
    <header className="sticky top-2 z-40 w-full max-w-7xl mx-auto px-3 sm:px-6">
      <div className="rounded-full dark:bg-[#0b0e14]/90 bg-white/95 backdrop-blur-md dark:border-[#1e2736] border-[#E6E8E5] border shadow-xs px-4 py-2.5 flex items-center justify-between gap-3 transition-colors">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab("architecture")}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity text-left"
          >
            <BrandLockup size="sm" subtitle="Quantum-resilient blockchain" />
          </button>
        </div>

        {/* Center: Navigation Pills (Matching Video Header) */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#F8F8F5] dark:bg-[#121721] p-1 rounded-full border dark:border-[#1e2736] border-[#E6E8E5]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? "bg-white dark:bg-[#1c2433] text-[#202124] dark:text-white shadow-xs font-semibold"
                    : "text-[#777B78] hover:text-[#202124] dark:hover:text-slate-200"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Controls & Signature Lime-Green Demo Button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Presentation Mode Toggle */}
          <button
            onClick={onTogglePresentation}
            title={isPresentationMode ? "Exit Presentation Mode" : "Enter Presentation Mode"}
            className="p-2 rounded-full dark:bg-[#141b24] bg-[#F8F8F5] hover:bg-[#eaebe7] dark:hover:bg-[#1e2736] border dark:border-[#1e2736] border-[#E6E8E5] text-[#777B78] hover:text-[#202124] dark:hover:text-white transition-all text-xs"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={isDark ? "Switch to Research Minimal (Light Mode)" : "Switch to Dark Obsidian (Night Mode)"}
            className="p-2 rounded-full dark:bg-[#141b24] bg-[#F8F8F5] hover:bg-[#eaebe7] dark:hover:bg-[#1e2736] border dark:border-[#1e2736] border-[#E6E8E5] text-[#777B78] hover:text-[#202124] dark:hover:text-white transition-all text-xs"
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            disabled={isRunning}
            title="Reset Workflow & Verification Gates"
            className="px-3 py-1.5 rounded-full dark:bg-[#141b24] bg-[#F8F8F5] hover:bg-[#eaebe7] dark:hover:bg-[#1e2736] border dark:border-[#1e2736] border-[#E6E8E5] text-[#777B78] hover:text-[#202124] dark:hover:text-white transition-all text-xs font-mono font-medium flex items-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Signature Video Lime-Green Button: (▷) Open the demo */}
          <button
            onClick={onRunSimulation}
            disabled={isRunning}
            className="px-4 py-1.5 rounded-full bg-[#96F34C] hover:bg-[#85e23b] text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? "animate-spin" : ""}`} />
            <span>{isRunning ? "Simulating..." : "Open the demo"}</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div className="flex lg:hidden overflow-x-auto py-2 gap-1.5 no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap border ${
                isActive
                  ? "bg-white dark:bg-[#1c2433] text-[#202124] dark:text-white border-[#00dc82] font-semibold"
                  : "bg-white/60 dark:bg-[#0b0e14]/60 text-[#777B78] border-[#E6E8E5] dark:border-[#1e2736]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};

