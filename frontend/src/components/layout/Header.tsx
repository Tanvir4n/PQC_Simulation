"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Cpu,
  Layers,
  Activity,
  FileText,
  Radio,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface HeaderProps {
  activeTab: string;
  isLiveMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, isLiveMode }) => {
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL.replace("/api", "")}/health`)
      .then((res) => setApiConnected(res.ok))
      .catch(() => setApiConnected(false));
  }, []);

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    overview: {
      title: "Research Platform Overview",
      subtitle: "Unified Simulation & Empirical Verification Dashboard"
    },
    network: {
      title: "01. Blockchain Network Simulator",
      subtitle: "100-Node Classical, Hybrid & Post-Quantum Topology & Directed Routing"
    },
    crypto: {
      title: "02. Hybrid Cryptography Simulator",
      subtitle: "ECDSA + ML-DSA-65 Dual KeyGen, Strict AND, & Packet Envelope Breakdown"
    },
    mempool: {
      title: "03. Transaction & Block Simulator",
      subtitle: "Mempool Ingestion, SHA3-512 Block Cubes, & Merkle Tree Hierarchy"
    },
    scalability: {
      title: "04. Performance & Scalability Lab",
      subtitle: "100 to 10k Workload Benchmarks, Peak TPS, & Analytical Storage Growth"
    },
    migration: {
      title: "05. Seven-Phase Migration Simulator",
      subtitle: "Staged Classical → Hybrid → PQC Transition & Mathematical Parity Trough"
    },
    security: {
      title: "06. Security & Attack Lab",
      subtitle: "Replay, Forgery, MITM, Key-Misbinding & Cumulative Protocol Ablation"
    },
    evm: {
      title: "07. Ethereum EVM Integration",
      subtitle: "Anvil Local Testnet, HybridAuth.sol Gas Telemetry, & 5 Functional Scenarios"
    }
  };

  const current = tabTitles[activeTab] || tabTitles.overview;

  return (
    <header className="h-16 bg-[#0a0e17]/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
          <span>{current.title}</span>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-normal text-slate-400">{current.subtitle}</span>
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Active Mode Pill */}
        <div
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5 border ${
            isLiveMode
              ? "bg-teal-500/10 text-teal-300 border-teal-500/30"
              : "bg-blue-500/10 text-blue-300 border-blue-500/30"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isLiveMode ? "bg-teal-400 animate-pulse" : "bg-blue-400"
            }`}
          />
          <span>{isLiveMode ? "Live Simulation Mode" : "Paper Reference Mode"}</span>
        </div>

        {/* Cryptographic Primitives Status */}
        <div className="hidden lg:flex items-center gap-2 border-l border-slate-800 pl-3">
          <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>secp256k1</span>
          </div>
          <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-purple-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            <span>ML-DSA-65</span>
          </div>
          <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>AND Verify</span>
          </div>
        </div>

        {/* Backend API Connection Status */}
        <div className="border-l border-slate-800 pl-3">
          {apiConnected ? (
            <div
              className="flex items-center gap-1 text-[11px] text-teal-400 bg-teal-950/40 px-2 py-1 rounded border border-teal-800/40"
              title="FastAPI Python engine connected"
            >
              <Radio className="w-3 h-3 animate-pulse" />
              <span>API Live</span>
            </div>
          ) : (
            <div
              className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-950/40 px-2 py-1 rounded border border-amber-800/40"
              title="Running on embedded research reference data"
            >
              <Activity className="w-3 h-3" />
              <span>Offline Ready</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

