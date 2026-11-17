"use client";

import React from "react";
import { X, ArrowLeft, Shield } from "lucide-react";
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-hidden animate-in fade-in duration-200">
      <div className="w-full max-w-7xl h-[92vh] rounded-3xl bg-[#080b10] border border-[#1e2736] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Header */}
        <div className="h-16 px-6 bg-[#0b0e14] border-b border-[#161d27] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#141b24] hover:bg-[#1f2937] text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00dc82]" />
              <h2 className="text-sm font-bold text-white tracking-wide">
                {titles[moduleId] || "Simulation Laboratory"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#00dc82]/10 text-[#00dc82] border border-[#00dc82]/30">
              {isLiveMode ? "Mode: Live Simulation Lab" : "Mode: Paper Reference (Read-Only)"}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#141b24] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-[#1e2736] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto">
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

