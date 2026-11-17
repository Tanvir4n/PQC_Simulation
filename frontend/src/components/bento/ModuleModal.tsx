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
    <div className="fixed inset-0 z-50 bg-black/80 dark:bg-black/85 light:bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200">
      <div className="w-full max-w-7xl h-[94vh] rounded-3xl dark:bg-[#080b10] bg-[#f8fafc] dark:border-[#1e2736] border-slate-300 border flex flex-col shadow-2xl overflow-hidden transition-colors">
        {/* Modal Top Header (Matching Bento macOS Bar) */}
        <div className="h-16 px-6 dark:bg-[#0b0e14] bg-white dark:border-b dark:border-[#161d27] border-b border-slate-200 flex items-center justify-between shrink-0 transition-colors">
          <div className="flex items-center gap-3">
            {/* macOS Style Traffic Dots */}
            <div className="hidden sm:flex items-center gap-1.5 pr-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl dark:bg-[#141b24] bg-slate-100 dark:hover:bg-[#1f2937] hover:bg-slate-200 dark:text-slate-400 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors border dark:border-transparent border-slate-200"
              title="Back to Bento Grid"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full dark:bg-[#00dc82] bg-emerald-600 animate-pulse" />
              <h2 className="text-sm font-bold dark:text-white text-slate-900 tracking-wide truncate max-w-[280px] sm:max-w-md">
                {titles[moduleId] || "Simulation Laboratory"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={isDark ? "Switch to Day Mode (Light Theme)" : "Switch to Night Mode (Dark Theme)"}
              className="p-1.5 px-2.5 rounded-xl dark:bg-[#07090d] bg-slate-100 hover:bg-slate-200 dark:hover:bg-[#141b24] dark:border-[#161d27] border-slate-200 border text-xs font-mono transition-all flex items-center gap-1.5"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline text-[11px] text-slate-400">Day</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline text-[11px] text-slate-600">Night</span>
                </>
              )}
            </button>

            {/* Mode Indicator Badge */}
            <span className="text-[11px] font-mono px-3 py-1 rounded-full dark:bg-[#00dc82]/10 bg-emerald-500/10 dark:text-[#00dc82] text-emerald-700 dark:border-[#00dc82]/30 border-emerald-500/30 border">
              {isLiveMode ? "Mode: Live Simulation Lab" : "Mode: Paper Reference"}
            </span>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl dark:bg-[#141b24] bg-slate-100 hover:bg-rose-950/40 hover:text-rose-500 dark:text-slate-400 text-slate-600 border dark:border-[#1e2736] border-slate-200 transition-colors"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto dark:bg-[#080b10] bg-[#f8fafc] text-slate-900 dark:text-slate-100 transition-colors">
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
