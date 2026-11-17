"use client";

import React from "react";
import {
  ShieldAlert,
  Network,
  KeyRound,
  Layers,
  LineChart,
  GitBranch,
  Bug,
  Cpu,
  BookOpen,
  Sparkles,
  ExternalLink,
  Lock,
  Zap
} from "lucide-react";
import { QuantumLogo } from "@/components/brand/QuantumLogo";

export type TabType =
  | "pipeline"
  | "overview"
  | "network"
  | "crypto"
  | "mempool"
  | "scalability"
  | "migration"
  | "security"
  | "evm";

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isLiveMode: boolean;
  setIsLiveMode: (live: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isLiveMode,
  setIsLiveMode
}) => {
  const navItems = [
    {
      id: "pipeline" as TabType,
      label: "Master Pipeline (E2E)",
      moduleNum: "★",
      icon: Zap,
      badge: "Creation→EVM"
    },
    {
      id: "overview" as TabType,
      label: "Research Overview",
      moduleNum: "00",
      icon: BookOpen,
      badge: "Summary"
    },
    {
      id: "network" as TabType,
      label: "Blockchain Network",
      moduleNum: "01",
      icon: Network,
      badge: "100 Nodes"
    },
    {
      id: "crypto" as TabType,
      label: "Hybrid Cryptography",
      moduleNum: "02",
      icon: KeyRound,
      badge: "3,380 B Sig"
    },
    {
      id: "mempool" as TabType,
      label: "Mempool & Blocks",
      moduleNum: "03",
      icon: Layers,
      badge: "SHA3-512"
    },
    {
      id: "scalability" as TabType,
      label: "Performance & Scaling",
      moduleNum: "04",
      icon: LineChart,
      badge: "10k Tx"
    },
    {
      id: "migration" as TabType,
      label: "7-Phase Migration",
      moduleNum: "05",
      icon: GitBranch,
      badge: "P1 → P7"
    },
    {
      id: "security" as TabType,
      label: "Security & Attacks",
      moduleNum: "06",
      icon: Bug,
      badge: "Ablation"
    },
    {
      id: "evm" as TabType,
      label: "Ethereum EVM Lab",
      moduleNum: "07",
      icon: Cpu,
      badge: "Anvil 31337"
    }
  ];

  return (
    <aside className="w-72 bg-[#0a0e17] border-r border-slate-800/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none">
      {/* Platform Branding */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl dark:bg-[#070a0e] bg-slate-900 border border-teal-500/30 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <QuantumLogo size={24} glow={true} />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-bold tracking-tight text-white">QuantumResist</h1>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                PQC
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[170px]">
              Hybrid Blockchain Simulator
            </p>
          </div>
        </div>

        {/* Dual Mode Switcher */}
        <div className="mt-4 p-1 bg-slate-900/90 rounded-lg border border-slate-800 flex items-center gap-1">
          <button
            onClick={() => setIsLiveMode(false)}
            className={`flex-1 text-xs py-1.5 px-2 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 ${
              !isLiveMode
                ? "bg-slate-800 text-teal-300 shadow border border-slate-700/50"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Reference</span>
          </button>
          <button
            onClick={() => setIsLiveMode(true)}
            className={`flex-1 text-xs py-1.5 px-2 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 ${
              isLiveMode
                ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md shadow-teal-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Lab</span>
          </button>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Simulation Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group ${
                isActive
                  ? "bg-slate-800/90 text-white border border-teal-500/30 shadow-md shadow-teal-500/5"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-teal-500/20 text-teal-400"
                      : "bg-slate-800/50 text-slate-400 group-hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-medium leading-tight">{item.label}</div>
                  <div className="text-[10px] text-slate-400">Module {item.moduleNum}</div>
                </div>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  isActive
                    ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                    : "bg-slate-800/60 text-slate-400"
                }`}
              >
                {item.badge}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Author & Academic Citation Badge */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-teal-400 uppercase tracking-wider">
              Research Paper
            </span>
            <a
              href="https://orcid.org/0009-0008-9130-3360"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-teal-400 transition-colors"
              title="Author ORCID Profile"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="text-xs font-semibold text-slate-200 mt-1">Md. Tanvir Hasan</div>
          <div className="text-[11px] text-slate-400">Dept. of Computer Science Engineering, DIU</div>
          <div className="mt-2 text-[10px] text-slate-400 font-mono">
            ECDSA + ML-DSA-65 (FIPS 204)
          </div>
        </div>
      </div>
    </aside>
  );
};

