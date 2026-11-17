"use client";

import React, { useState } from "react";
import {
  KeyRound,
  Network,
  Layers,
  LineChart,
  GitBranch,
  Bug,
  Cpu,
  ChevronDown,
  ChevronRight,
  Shield,
  ArrowRight
} from "lucide-react";

export interface PillarItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: any;
  specs: { title: string; desc: string }[];
}

interface PillarAccordionProps {
  onOpenModule: (id: string) => void;
}

export const PillarAccordion: React.FC<PillarAccordionProps> = ({ onOpenModule }) => {
  const [activeId, setActiveId] = useState<string>("crypto");

  const pillars: PillarItem[] = [
    {
      id: "crypto",
      name: "Hybrid Cryptography",
      subtitle: "ECDSA + ML-DSA-65 Conjunction",
      description:
        "Pairs secp256k1 with standardized ML-DSA-65 (NIST FIPS 204). Evaluates independent key generation, dual-public-key binding, and strict AND verification.",
      icon: KeyRound,
      specs: [
        {
          title: "3,380 Byte Signature",
          desc: "1B version + 70B DER ECDSA sample + 3,309B ML-DSA-65 string."
        },
        {
          title: "Strict Conjunction (AND)",
          desc: "Accepts only if both classical and post-quantum components validate (be ∧ bpq)."
        },
        {
          title: "Canonical Context Digest",
          desc: "Domain-separated SHA3-512('HYB-SIG' || Enc(v, αe, αpq, m)) binds all descriptor fields."
        }
      ]
    },
    {
      id: "network",
      name: "100-Node Network Simulator",
      subtitle: "Topology & Directed Routing",
      description:
        "100-node simulated mesh network with Classical, Hybrid, and PQC nodes. Tests peer routing and verifies asymmetric compatibility rules.",
      icon: Network,
      specs: [
        {
          title: "Asymmetric Rejection",
          desc: "C→C, C→H, and H→H pass; H→C is rejected (classical nodes cannot parse ML-DSA-65)."
        },
        {
          title: "Simulated Mesh Delay",
          desc: "Small-world peer connections with 1.2 to 4.8 ms simulated network latency."
        },
        {
          title: "Live Routing Traces",
          desc: "Hop-by-hop packet inspection with visual status and failure reasoning."
        }
      ]
    },
    {
      id: "mempool",
      name: "Mempool & Block Engine",
      subtitle: "Cubic Blocks & Merkle Trees",
      description:
        "Futuristic mempool ingestion pipeline inspired by Mempool.space with cubic block visualization and SHA3-512 binary Merkle trees.",
      icon: Layers,
      specs: [
        {
          title: "Duplicate Rejection",
          desc: "Transaction-hash pool detects and drops duplicate submissions immediately."
        },
        {
          title: "SHA3-512 Merkle Root",
          desc: "Binary tree hashes each transaction leaf to candidate block headers."
        },
        {
          title: "Block Packaging",
          desc: "Encapsulates up to 10 transactions per block with header nonce commitments."
        }
      ]
    },
    {
      id: "scalability",
      name: "Scalability & Performance",
      subtitle: "100 to 10k Workload Scaling",
      description:
        "Evaluates transaction execution, throughput, and CPU load across 100 to 10,000 transactions. Documents the 1,054 TPS peak and saturation behavior.",
      icon: LineChart,
      specs: [
        {
          title: "1,054.00 TPS Peak",
          desc: "Achieved at 1,000 hybrid transactions with 0.9490 ms per-tx latency."
        },
        {
          title: "27.04 Mbps Bandwidth",
          desc: "Signature-only serialization requirement at 1,000 TPS (48.3x vs ECDSA)."
        },
        {
          title: "3.38 GB Ledger Projections",
          desc: "Signature storage lower bound per 1,000,000 transactions."
        }
      ]
    },
    {
      id: "migration",
      name: "7-Phase Migration Model",
      subtitle: "P1 Classical to P7 Post-Quantum",
      description:
        "Simulates staged transition across seven phases. Proves and visualizes the mathematical 75.4% compatibility parity trough.",
      icon: GitBranch,
      specs: [
        {
          title: "Parity Trough at P3",
          desc: "P_compat = 1 - p_H * p_C yields 75% theoretical minimum at 50/50 parity."
        },
        {
          title: "Classical Retirement (P5)",
          desc: "100% compatibility restored once classical-only receivers are retired."
        },
        {
          title: "PQC Speedup (P7)",
          desc: "Peak throughput of 4,107.50 TPS achieved in pure ML-DSA-65 mode."
        }
      ]
    },
    {
      id: "security",
      name: "Security & Protocol Ablation",
      subtitle: "6 Threat Classes & Table 11",
      description:
        "Evaluates Replay, Forgery, MITM, Duplicate, Key-Misbinding, and Downgrade attacks across six cumulative protocol configurations.",
      icon: Bug,
      specs: [
        {
          title: "+100 pp Specific Gains",
          desc: "Key binding, AND verification, and replay protection each add 100 pp defense."
        },
        {
          title: "Full Framework (C5)",
          desc: "Blocks 100% of reported attack scenarios across all six categories."
        },
        {
          title: "Quantum Unforgeability",
          desc: "EUF-CMA_Q reduction holds even under complete ECDSA private key compromise."
        }
      ]
    },
    {
      id: "evm",
      name: "Ethereum EVM Integration",
      subtitle: "Anvil 31337 & HybridAuth.sol",
      description:
        "Exercises stateful acceptance policies, application nonces, and gas costs on a local Anvil EVM contract via Web3.py.",
      icon: Cpu,
      specs: [
        {
          title: "240,028 Deployment Gas",
          desc: "HybridAuth.sol deployed on local Anvil (Chain ID 31337)."
        },
        {
          title: "70,442 Accepted Tx Gas",
          desc: "State transition updates sender nonce and sets processed mapping."
        },
        {
          title: "5/5 Functional Pass Rate",
          desc: "Rejection cases revert cleanly during pre-submission eth_estimateGas."
        }
      ]
    }
  ];

  return (
    <div className="rounded-2xl bg-[#0b0e14] border border-[#161d27] divide-y divide-[#161d27] overflow-hidden">
      {pillars.map((p) => {
        const isExpanded = activeId === p.id;
        const Icon = p.icon;

        return (
          <div key={p.id} className="transition-colors">
            {/* Header row */}
            <div
              onClick={() => setActiveId(isExpanded ? "" : p.id)}
              className="cursor-pointer p-4 hover:bg-[#0f141c] flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isExpanded
                      ? "bg-[#00dc82]/20 text-[#00dc82]"
                      : "bg-[#141a24] text-slate-400 group-hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-[#00dc82] transition-colors">
                    {p.name}
                  </h4>
                  <div className="text-[10px] text-slate-500 font-mono">{p.subtitle}</div>
                </div>
              </div>

              <div className="text-slate-500 group-hover:text-slate-300">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-[#00dc82]" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            </div>

            {/* Expanded content (Matching user image 1 & 2 left side) */}
            {isExpanded && (
              <div className="px-5 pb-5 pt-1 space-y-3 bg-[#080b10] border-t border-[#141a24]">
                <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>

                {/* Inspect Action Header */}
                <div className="flex items-center justify-between pt-1 border-t border-[#161d27]">
                  <button
                    onClick={() => onOpenModule(p.id)}
                    className="text-xs font-mono font-semibold text-[#00dc82] hover:underline flex items-center gap-1.5"
                  >
                    <span>→ [Inspect: {p.name}]</span>
                  </button>
                  <span className="text-[11px] font-mono text-slate-500">[-]</span>
                </div>

                {/* Left Green Line Bullet List */}
                <div className="space-y-2.5 pl-3 border-l border-[#00dc82]/50 text-xs font-mono">
                  {p.specs.map((s, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="text-slate-200 font-bold">{s.title}</div>
                      <div className="text-[11px] text-slate-500 leading-normal">{s.desc}</div>
                    </div>
                  ))}
                </div>

                {/* Launch Button */}
                <button
                  onClick={() => onOpenModule(p.id)}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-[#00dc82] hover:bg-[#00c574] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-[#00dc82]/10"
                >
                  <span>Open Interactive Lab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

