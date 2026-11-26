"use client";

import React from "react";
import { X, ArrowLeft, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { NetworkModule } from "@/components/modules/NetworkModule";
import { CryptoModule } from "@/components/modules/CryptoModule";
import { MempoolModule } from "@/components/modules/MempoolModule";
import { ScalabilityModule } from "@/components/modules/ScalabilityModule";
import { MigrationModule } from "@/components/modules/MigrationModule";
import { SecurityModule } from "@/components/modules/SecurityModule";
import { EVMModule } from "@/components/modules/EVMModule";
import { OverviewModule } from "@/components/modules/OverviewModule";
import { PipelineModule } from "@/components/modules/PipelineModule";

interface ModuleModalProps {
  moduleId: string | null;
  onClose: () => void;
  isLiveMode: boolean;
  onSelectModule: (id: string) => void;
}

export const ModuleModal: React.FC<ModuleModalProps> = ({
  moduleId,
  onClose,
  isLiveMode,
  onSelectModule,
}) => {
  const { isDark, toggleTheme } = useTheme();

  if (!moduleId) return null;

  const titles: Record<string, string> = {
    pipeline: "Master Module: Full End-to-End Hybrid Transaction Lifecycle Simulator",
    overview: "Research Overview & Baseline Telemetry",
    crypto: "Module 02: Hybrid Cryptography & Byte Envelope Simulator",
    network: "Module 01: 100-Node Network Simulator & Directed Routing",
    mempool: "Module 03: Mempool Pipeline & SHA3-512 Merkle Block Engine",
    scalability: "Module 04: Performance & Scalability Laboratory",
    migration: "Module 05: Seven-Phase Migration & Parity Trough Simulator",
    security: "Module 06: Adversarial Attack Lab & Cumulative Protocol Ablation",
    evm: "Module 07: Ethereum EVM Integration & HybridAuth Gas Analysis",
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200">
      <div className="w-full max-w-7xl h-[94vh] rounded-3xl dark:bg-[#0f110e] bg-[#fbfaf6] dark:border-[#23271f] border-[#e6e4da] border flex flex-col shadow-2xl overflow-hidden transition-colors">
        {/* Modal Top Header (Unified Simulation Paper / Obsidian Bar, No Traffic Dots) */}
        <div className="h-16 px-4 sm:px-6 dark:bg-[#141712] bg-[#fdfdfa] dark:border-b dark:border-[#23271f] border-b border-[#e6e4da] flex items-center justify-between shrink-0 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onClose}
              className="p-2 rounded-full dark:bg-[#12140f] bg-[#f6f5ef] dark:hover:bg-[#1c2019] hover:bg-[#efeee7] dark:text-[#b2b0a6] text-[#5c5a53] dark:hover:text-[#ecebe4] hover:text-[#1d1d1a] transition-colors border dark:border-[#23271f] border-[#e6e4da]"
              title="Back to Overview"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#7cc046] dark:bg-[#9be05a] shrink-0" />
              <h2 className="text-sm font-bold dark:text-[#ecebe4] text-[#1d1d1a] tracking-tight truncate max-w-[240px] sm:max-w-lg">
                {titles[moduleId] || "Simulation Laboratory"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Fixed-Size Animated Day / Night Toggle */}
            <button
              type="button"
              onClick={(e) => toggleTheme(e)}
              title={isDark ? "Switch to Day Mode (Light Theme)" : "Switch to Night Mode (Dark Theme)"}
              className="relative flex items-center justify-center gap-2 w-[38px] sm:w-[92px] h-[36px] rounded-full dark:bg-[#12140f] bg-[#f6f5ef] hover:bg-[#efeee7] dark:hover:bg-[#1c2019] dark:border-[#23271f] border-[#e6e4da] border text-xs font-mono transition-colors duration-300 shrink-0 outline-none focus:outline-none overflow-hidden select-none"
            >
              <span className="relative w-4 h-4 shrink-0 flex items-center justify-center">
                <Sun
                  className={`w-3.5 h-3.5 text-amber-400 absolute transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
                  }`}
                />
                <Moon
                  className={`w-3.5 h-3.5 text-[#5c5a53] absolute transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
                  }`}
                />
              </span>
              <span className="hidden sm:inline-flex relative w-[36px] h-4 items-center overflow-hidden">
                <span
                  className={`absolute inset-0 flex items-center text-[11px] font-medium text-[#b2b0a6] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isDark ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2.5"
                  }`}
                >
                  Day
                </span>
                <span
                  className={`absolute inset-0 flex items-center text-[11px] font-medium text-[#5c5a53] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isDark ? "opacity-0 translate-y-2.5" : "opacity-100 translate-y-0"
                  }`}
                >
                  Night
                </span>
              </span>
            </button>

            {/* Mode Indicator Badge */}
            <span className="hidden md:inline-flex text-[11px] font-mono px-3 py-1 rounded-full bg-[#f2f7f0] dark:bg-[#5fca8c]/10 text-[#2e7d4f] dark:text-[#5fca8c] border border-[#a9cfb2] dark:border-[#5fca8c]/30 font-semibold">
              {isLiveMode ? "Mode: Live Simulation Lab" : "Mode: Paper Reference"}
            </span>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full dark:bg-[#12140f] bg-[#f6f5ef] hover:bg-[#fbf1ed] dark:hover:bg-[#ef7a63]/15 hover:text-[#c0432f] dark:hover:text-[#ef7a63] dark:text-[#b2b0a6] text-[#5c5a53] border dark:border-[#23271f] border-[#e6e4da] transition-colors"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 dark:bg-[#0f110e] bg-[#fbfaf6] text-[#1d1d1a] dark:text-[#ecebe4] transition-colors">
          {moduleId === "pipeline" && <PipelineModule isLiveMode={isLiveMode} />}
          {moduleId === "overview" && (
            <OverviewModule setActiveTab={onSelectModule as any} isLiveMode={isLiveMode} />
          )}
          {moduleId === "crypto" && <CryptoModule isLiveMode={isLiveMode} />}
          {moduleId === "network" && <NetworkModule isLiveMode={isLiveMode} />}
          {moduleId === "mempool" && <MempoolModule isLiveMode={isLiveMode} />}
          {moduleId === "scalability" && <ScalabilityModule isLiveMode={isLiveMode} />}
          {moduleId === "migration" && <MigrationModule isLiveMode={isLiveMode} />}
          {moduleId === "security" && <SecurityModule isLiveMode={isLiveMode} />}
          {moduleId === "evm" && <EVMModule isLiveMode={isLiveMode} />}
        </div>
      </div>
    </div>
  );
};
