"use client";

import React from "react";

export interface ScenarioItem {
  id: string;
  label: string;
  badge: string;
  dotColor: string; // Tailwind bg color class
  description: string;
  expectedOutcome: "ACCEPT" | "REJECT";
}

export const SCENARIOS: ScenarioItem[] = [
  {
    id: "normal",
    label: "Normal Hybrid Transaction",
    badge: "Valid Both",
    dotColor: "bg-[#00dc82]",
    description: "Authentic ECDSA (secp256k1) and ML-DSA-65 signatures under SHA3-512 canonical context. Fresh nonce.",
    expectedOutcome: "ACCEPT"
  },
  {
    id: "ecdsa_invalid",
    label: "Quantum Attack: Forged ECDSA",
    badge: "b_e = 0",
    dotColor: "bg-rose-500",
    description: "Adversary exploits Shor's algorithm to forge ECDSA scalar. Fails ML-DSA-65 lattice gate. Strict AND rejects.",
    expectedOutcome: "REJECT"
  },
  {
    id: "mldsa_invalid",
    label: "Classical Attack: Corrupted ML-DSA",
    badge: "b_pq = 0",
    dotColor: "bg-rose-500",
    description: "Lattice signature coefficients tampered or missing. Fails FIPS 204 infinity norm check. Strict AND rejects.",
    expectedOutcome: "REJECT"
  },
  {
    id: "replay_nonce",
    label: "Replay Attack: Stale Nonce",
    badge: "Nonce 0 Re-use",
    dotColor: "bg-amber-500",
    description: "Valid signature intercepted and re-broadcast with consumed nonce. Rejected by Mempool & EVM state guard.",
    expectedOutcome: "REJECT"
  },
  {
    id: "payload_modified",
    label: "MITM Attack: Payload Modified",
    badge: "Hash Mismatch",
    dotColor: "bg-rose-500",
    description: "Transfer amount modified in-flight. Canonical digest d = SHA3-512(...) diverges. Both checks fail.",
    expectedOutcome: "REJECT"
  },
  {
    id: "version_unsupported",
    label: "Downgrade Attack: Version 0x99",
    badge: "Invalid Version",
    dotColor: "bg-rose-500",
    description: "Adversary alters envelope version byte to induce legacy fallback. Parser allow-list immediately halts execution.",
    expectedOutcome: "REJECT"
  }
];

interface ScenarioBarProps {
  selectedScenario: string;
  onSelectScenario: (scenario: ScenarioItem) => void;
  isRunning: boolean;
}

export const ScenarioBar: React.FC<ScenarioBarProps> = ({
  selectedScenario,
  onSelectScenario,
  isRunning
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 mt-3">
      <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
        <span className="text-[11px] font-mono font-bold text-[#777B78] uppercase shrink-0 mr-1 hidden sm:inline">
          Test Scenarios:
        </span>
        {SCENARIOS.map((sc) => {
          const isSelected = selectedScenario === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => onSelectScenario(sc)}
              disabled={isRunning}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all whitespace-nowrap border shrink-0 ${
                isSelected
                  ? "bg-white dark:bg-[#121721] text-[#202124] dark:text-white border-[#00dc82] shadow-xs font-semibold ring-1 ring-[#00dc82]/30"
                  : "bg-white/70 dark:bg-[#0b0e14]/70 text-[#777B78] border-[#E6E8E5] dark:border-[#1e2736] hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${sc.dotColor} shrink-0`} />
              <span>{sc.label}</span>
              <span
                className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase ${
                  sc.expectedOutcome === "ACCEPT"
                    ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400"
                }`}
              >
                {sc.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

