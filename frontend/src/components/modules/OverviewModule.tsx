"use client";

import React from "react";
import {
  Shield,
  Network,
  KeyRound,
  Layers,
  LineChart,
  GitBranch,
  Bug,
  Cpu,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Award,
  Zap,
  HardDrive
} from "lucide-react";
import { TabType } from "@/components/layout/Sidebar";
import { PAPER_REFERENCE_DATA } from "@/lib/api";

interface OverviewModuleProps {
  setActiveTab: (tab: TabType) => void;
  isLiveMode: boolean;
}

export const OverviewModule: React.FC<OverviewModuleProps> = ({
  setActiveTab,
  isLiveMode
}) => {
  const { keyMetrics, metadata } = PAPER_REFERENCE_DATA;

  const statCards = [
    {
      title: "Peak Throughput",
      value: `${keyMetrics.peakTps.toLocaleString()} TPS`,
      sub: "Workload: 1,000 hybrid tx",
      icon: Zap,
      color: "dark:text-[#00dc82] text-emerald-600",
    },
    {
      title: "Lowest Mean Latency",
      value: `${keyMetrics.minLatencyMs} ms`,
      sub: "Per transaction verification",
      icon: LineChart,
      color: "dark:text-cyan-400 text-cyan-600",
    },
    {
      title: "Hybrid Signature Size",
      value: `${keyMetrics.hybridSigBytes} B`,
      sub: "48.3x vs 70B ECDSA sample",
      icon: KeyRound,
      color: "dark:text-purple-400 text-purple-600",
    },
    {
      title: "Attack Resistance",
      value: "100%",
      sub: "All 6 threat classes blocked",
      icon: Shield,
      color: "dark:text-[#00dc82] text-emerald-600",
    },
    {
      title: "EVM Deployment Gas",
      value: `${keyMetrics.deploymentGas.toLocaleString()} gas`,
      sub: "HybridAuth.sol on Anvil",
      icon: Cpu,
      color: "dark:text-amber-400 text-amber-600",
    },
    {
      title: "Workload Success Rate",
      value: "100.0%",
      sub: "100 to 10,000 transactions",
      icon: CheckCircle2,
      color: "dark:text-blue-400 text-blue-600",
    }
  ];

  const modules = [
    {
      id: "network" as TabType,
      num: "01",
      title: "Blockchain Network Simulator",
      desc: "100-node visual topology with Classical, Hybrid, and PQC nodes. Tests directed packet routing and asymmetric compatibility.",
      icon: Network,
    },
    {
      id: "crypto" as TabType,
      num: "02",
      title: "Hybrid Cryptography Simulator",
      desc: "Dual key generation (secp256k1 + ML-DSA-65), 3,380B envelope byte breakdown, and interactive bit-tampering sandbox.",
      icon: KeyRound,
    },
    {
      id: "mempool" as TabType,
      num: "03",
      title: "Transaction & Block Simulator",
      desc: "Mempool queue, cubic block visualizer (mempool.space style), and interactive SHA3-512 Merkle Tree generator.",
      icon: Layers,
    },
    {
      id: "scalability" as TabType,
      num: "04",
      title: "Performance & Scalability Lab",
      desc: "Workload scaling from 100 to 10k transactions. TPS, latency, 27.04 Mbps serialization rate, and 3.38 GB ledger projections.",
      icon: LineChart,
    },
    {
      id: "migration" as TabType,
      num: "05",
      title: "Seven-Phase Migration Simulator",
      desc: "P1 to P7 lifecycle progression. Visualizes the 75.4% compatibility parity trough and post-quantum recovery.",
      icon: GitBranch,
    },
    {
      id: "security" as TabType,
      num: "06",
      title: "Security & Attack Lab",
      desc: "Replay, Forgery, MITM, Key-Misbinding, and cumulative Protocol Ablation matrix (Table 11) with formal EUF-CMA bounds.",
      icon: Bug,
    },
    {
      id: "evm" as TabType,
      num: "07",
      title: "Ethereum EVM Integration",
      desc: "Local Anvil testnet execution of HybridAuth.sol contract, gas telemetry, and 5 functional test scenarios.",
      icon: Cpu,
    }
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto transition-colors">
      {/* Paper Hero Section (Bento Master Card) */}
      <div className="relative rounded-2xl dark:bg-[#0b0e14] bg-white dark:border-[#161d27] border-slate-200 border p-6 md:p-8 shadow-sm overflow-hidden transition-all">
        <div className="absolute top-0 right-0 w-96 h-96 dark:bg-[#00dc82]/5 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full dark:bg-[#00dc82]/10 bg-emerald-500/10 dark:border-[#00dc82]/20 border-emerald-500/30 border text-xs dark:text-[#00dc82] text-emerald-700 font-mono font-medium">
            <Award className="w-3.5 h-3.5" />
            <span>Research Paper Interactive Simulator</span>
          </div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold dark:text-white text-slate-900 tracking-tight leading-tight">
            {metadata.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono dark:text-slate-400 text-slate-600">
            <div>
              <span className="dark:text-slate-500 text-slate-400">Author: </span>
              <strong className="dark:text-slate-200 text-slate-800">{metadata.author}</strong>
            </div>
            <div>
              <span className="dark:text-slate-500 text-slate-400">Affiliation: </span>
              <span className="dark:text-slate-300 text-slate-700">{metadata.affiliation}</span>
            </div>
            <div>
              <span className="dark:text-slate-500 text-slate-400">ORCID: </span>
              <a
                href={`https://orcid.org/${metadata.orcid}`}
                target="_blank"
                rel="noreferrer"
                className="dark:text-[#00dc82] text-emerald-600 hover:underline font-bold"
              >
                {metadata.orcid}
              </a>
            </div>
          </div>
          <p className="text-xs dark:text-slate-400 text-slate-600 leading-relaxed max-w-4xl pt-1 font-mono">
            This platform interactively demonstrates the proposed crypto-agile blockchain architecture pairing
            classical <code className="dark:text-cyan-400 text-cyan-600 font-bold">secp256k1 ECDSA</code> with standardized post-quantum{" "}
            <code className="dark:text-[#00dc82] text-emerald-600 font-bold">ML-DSA-65 (NIST FIPS 204)</code> under strict conjunction (AND) verification,
            evaluating 100-node network routing, 10,000-transaction workloads, 7-phase migration compatibility,
            protocol ablation attack resistance, and Anvil EVM smart contract state transitions.
          </p>
        </div>
      </div>

      {/* Key Metric Highlights in Bento Grid Style */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full dark:bg-[#00dc82] bg-emerald-600 animate-pulse" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider dark:text-slate-400 text-slate-600">
              Empirical Paper Benchmarks (Baseline Results)
            </h2>
          </div>
          <span className="text-[11px] font-mono dark:text-[#00dc82] text-emerald-600">
            {isLiveMode ? "Mode: Live Lab" : "Mode: Ground Truth Reference"}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {statCards.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="rounded-2xl dark:bg-[#0b0e14] bg-white dark:border-[#161d27] border-slate-200 border p-4 flex flex-col justify-between transition-all hover:scale-[1.02] shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-medium dark:text-slate-400 text-slate-500 truncate">
                    {c.title}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${c.color}`} />
                </div>
                <div>
                  <div className={`text-xl font-bold tracking-tight ${c.color} font-mono`}>
                    {c.value}
                  </div>
                  <div className="text-[10px] dark:text-slate-500 text-slate-400 font-mono mt-0.5 truncate">
                    {c.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7 Interactive Simulation Modules Launchpad in Bento Style */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full dark:bg-[#00dc82] bg-emerald-600 animate-pulse" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider dark:text-slate-400 text-slate-600">
            Interactive Simulation Modules (7 Pillars)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                onClick={() => setActiveTab(m.id)}
                className="group cursor-pointer rounded-2xl dark:bg-[#0b0e14] bg-white dark:border-[#161d27] border-slate-200 border p-5 dark:hover:border-[#263344] hover:border-slate-300 dark:hover:bg-[#121721] hover:bg-slate-50 transition-all flex flex-col justify-between shadow-sm min-h-[180px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg dark:bg-[#00dc82]/10 bg-emerald-500/10 dark:text-[#00dc82] text-emerald-700 dark:border-[#00dc82]/20 border-emerald-500/30 border">
                      Module {m.num}
                    </span>
                    <div className="w-8 h-8 rounded-xl dark:bg-[#07090d] bg-slate-100 dark:border-[#141a24] border-slate-200 border flex items-center justify-center dark:text-[#00dc82] text-emerald-600 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold dark:text-white text-slate-900 group-hover:text-emerald-600 dark:group-hover:text-[#00dc82] transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-xs dark:text-slate-400 text-slate-600 mt-2 line-clamp-2 font-mono text-[11px] leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="pt-4 border-t dark:border-[#161d27] border-slate-200 flex items-center justify-between text-xs font-mono">
                  <span className="dark:text-slate-500 text-slate-400 text-[10px]">DIU CSE Paper</span>
                  <span className="dark:text-[#00dc82] text-emerald-600 font-semibold group-hover:underline flex items-center gap-1 text-[11px]">
                    <span>[Inspect]</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
