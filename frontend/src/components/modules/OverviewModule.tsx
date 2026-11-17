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
      color: "text-cyan-400",
      border: "border-cyan-500/30",
      bg: "bg-cyan-950/20"
    },
    {
      title: "Lowest Mean Latency",
      value: `${keyMetrics.minLatencyMs} ms`,
      sub: "Per transaction verification",
      icon: LineChart,
      color: "text-teal-400",
      border: "border-teal-500/30",
      bg: "bg-teal-950/20"
    },
    {
      title: "Hybrid Signature Size",
      value: `${keyMetrics.hybridSigBytes} B`,
      sub: "48.3x vs 70B ECDSA sample",
      icon: KeyRound,
      color: "text-purple-400",
      border: "border-purple-500/30",
      bg: "bg-purple-950/20"
    },
    {
      title: "Attack Resistance",
      value: "100%",
      sub: "All 6 threat classes blocked",
      icon: Shield,
      color: "text-emerald-400",
      border: "border-emerald-500/30",
      bg: "bg-emerald-950/20"
    },
    {
      title: "EVM Deployment Gas",
      value: `${keyMetrics.deploymentGas.toLocaleString()} gas`,
      sub: "HybridAuth.sol on Anvil",
      icon: Cpu,
      color: "text-amber-400",
      border: "border-amber-500/30",
      bg: "bg-amber-950/20"
    },
    {
      title: "Workload Success Rate",
      value: "100.0%",
      sub: "100 to 10,000 transactions",
      icon: CheckCircle2,
      color: "text-blue-400",
      border: "border-blue-500/30",
      bg: "bg-blue-950/20"
    }
  ];

  const modules = [
    {
      id: "network" as TabType,
      num: "01",
      title: "Blockchain Network Simulator",
      desc: "100-node visual topology with Classical, Hybrid, and PQC nodes. Tests directed packet routing and asymmetric compatibility.",
      icon: Network,
      color: "from-cyan-500 to-blue-600"
    },
    {
      id: "crypto" as TabType,
      num: "02",
      title: "Hybrid Cryptography Simulator",
      desc: "Dual key generation (secp256k1 + ML-DSA-65), 3,380B envelope byte breakdown, and interactive bit-tampering sandbox.",
      icon: KeyRound,
      color: "from-teal-500 to-emerald-600"
    },
    {
      id: "mempool" as TabType,
      num: "03",
      title: "Transaction & Block Simulator",
      desc: "Mempool queue, cubic block visualizer (mempool.space style), and interactive SHA3-512 Merkle Tree generator.",
      icon: Layers,
      color: "from-purple-500 to-indigo-600"
    },
    {
      id: "scalability" as TabType,
      num: "04",
      title: "Performance & Scalability Lab",
      desc: "Workload scaling from 100 to 10k transactions. TPS, latency, 27.04 Mbps serialization rate, and 3.38 GB ledger projections.",
      icon: LineChart,
      color: "from-amber-500 to-orange-600"
    },
    {
      id: "migration" as TabType,
      num: "05",
      title: "Seven-Phase Migration Simulator",
      desc: "P1 to P7 lifecycle progression. Visualizes the 75.4% compatibility parity trough and post-quantum recovery.",
      icon: GitBranch,
      color: "from-rose-500 to-pink-600"
    },
    {
      id: "security" as TabType,
      num: "06",
      title: "Security & Attack Lab",
      desc: "Replay, Forgery, MITM, Key-Misbinding, and cumulative Protocol Ablation matrix (Table 11) with formal EUF-CMA bounds.",
      icon: Bug,
      color: "from-emerald-500 to-teal-700"
    },
    {
      id: "evm" as TabType,
      num: "07",
      title: "Ethereum EVM Integration",
      desc: "Local Anvil testnet execution of HybridAuth.sol contract, gas telemetry, and 5 functional test scenarios.",
      icon: Cpu,
      color: "from-blue-600 to-purple-600"
    }
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Paper Hero Section */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-[#0d1624] border border-slate-800 p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300 font-medium">
            <Award className="w-3.5 h-3.5" />
            <span>Research Paper Interactive Simulator</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {metadata.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400">
            <div>
              <span className="text-slate-400">Author: </span>
              <strong className="text-slate-200">{metadata.author}</strong>
            </div>
            <div>
              <span className="text-slate-400">Affiliation: </span>
              <span className="text-slate-300">{metadata.affiliation}</span>
            </div>
            <div>
              <span className="text-slate-400">ORCID: </span>
              <a
                href={`https://orcid.org/${metadata.orcid}`}
                target="_blank"
                rel="noreferrer"
                className="text-teal-400 hover:underline font-mono"
              >
                {metadata.orcid}
              </a>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-4xl pt-2">
            This platform interactively demonstrates the proposed crypto-agile blockchain architecture pairing
            classical <code className="text-cyan-400">secp256k1 ECDSA</code> with standardized post-quantum{" "}
            <code className="text-purple-400">ML-DSA-65 (NIST FIPS 204)</code> under strict conjunction (AND) verification,
            evaluating 100-node network routing, 10,000-transaction workloads, 7-phase migration compatibility,
            protocol ablation attack resistance, and Anvil EVM smart contract state transitions.
          </p>
        </div>
      </div>

      {/* Key Metric Highlights */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Empirical Paper Benchmarks (Baseline Results)
          </h2>
          <span className="text-xs text-teal-400 font-mono">
            {isLiveMode ? "Viewing in Live Lab Mode" : "Viewing Ground Truth (Read-Only)"}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className={`rounded-xl border ${c.border} ${c.bg} p-4 flex flex-col justify-between transition-all hover:scale-[1.02]`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-slate-400 truncate">{c.title}</span>
                  <Icon className={`w-4 h-4 ${c.color}`} />
                </div>
                <div>
                  <div className={`text-xl font-bold tracking-tight ${c.color} font-mono`}>
                    {c.value}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">{c.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7 Modules Launchpad */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
          Interactive Simulation Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                onClick={() => setActiveTab(m.id)}
                className="group cursor-pointer rounded-xl bg-slate-900/60 border border-slate-800 p-5 hover:border-teal-500/40 hover:bg-slate-900/90 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-teal-400 border border-slate-700">
                      Module {m.num}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-teal-400 group-hover:bg-teal-500/20 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-teal-400">
                  <span>Open Simulation</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Academic Credibility Guardrails */}
      <div className="rounded-xl bg-amber-950/20 border border-amber-500/30 p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
              Scientific Integrity & Scope Distinction (Section 3.5 & 3.8)
            </h4>
            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
              <li>
                <strong>100-Node Network Simulator:</strong> Represents an implementation-level discrete-event simulation
                measuring transaction creation, dual signature verification, duplicate handling, and local propagation latency.
                It excludes distributed Byzantine consensus, peer-to-peer gossip fanout, and validator coordination.
              </li>
              <li>
                <strong>EVM Smart Contract Integration:</strong> Evaluates sender nonce enforcement, replay protection, and
                acceptance policies in Solidity with caller-supplied Boolean verification outcomes. Off-chain ML-DSA-65 verification
                occurs in the Python research layer; it does not represent native on-chain lattice precompile execution.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

