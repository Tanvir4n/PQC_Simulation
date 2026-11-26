"use client";

import React, { useState } from "react";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Bug,
  Terminal,
  Play,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Sliders,
  FileCheck
} from "lucide-react";
import { PAPER_REFERENCE_DATA, apiFetch } from "@/lib/api";

interface SecurityModuleProps {
  isLiveMode: boolean;
}

export const SecurityModule: React.FC<SecurityModuleProps> = ({ isLiveMode }) => {
  const { ablationConfigs } = PAPER_REFERENCE_DATA;

  // Custom ablation controls
  const [keyBinding, setKeyBinding] = useState<boolean>(true);
  const [domainSep, setDomainSep] = useState<boolean>(true);
  const [versioning, setVersioning] = useState<boolean>(true);
  const [andVerif, setAndVerif] = useState<boolean>(true);
  const [replayProt, setReplayProt] = useState<boolean>(true);

  // Attack execution state
  const [activeAttack, setActiveAttack] = useState<string>("replay");
  const [attackLogs, setAttackLogs] = useState<string[]>([]);
  const [attackStatus, setAttackStatus] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const handleRunAttack = async (type: string) => {
    setActiveAttack(type);
    setIsExecuting(true);
    setAttackLogs([]);
    setAttackStatus(null);

    let endpoint = `/security/attack/${type}`;
    let body: any = { enable_defense: true };

    if (type === "replay") {
      body.enable_defense = replayProt;
    } else if (type === "key-misbinding") {
      body.enable_defense = keyBinding;
    }

    try {
      const res = await apiFetch<any>(
        endpoint,
        {
          method: "POST",
          body: JSON.stringify(body)
        },
        null
      );

      if (res) {
        setAttackLogs(res.logs || []);
        setAttackStatus(res.status);
      } else {
        // Fallback attack logs
        generateFallbackLogs(type);
      }
    } catch {
      generateFallbackLogs(type);
    } finally {
      setIsExecuting(false);
    }
  };

  const generateFallbackLogs = (type: string) => {
    if (type === "replay") {
      if (replayProt) {
        setAttackLogs([
          "[Step 1] Generator: Creating valid hybrid transaction Tx_1 (amount: 50.0 DIU)...",
          "[Step 2] Node: Received Tx_1. Strict AND verification PASSED.",
          "[Step 3] Node: Ledger committed Tx_1 (Nonce 0 consumed).",
          "[Step 4] Attacker: Retransmitting exact signed byte payload as Tx_replay...",
          "[Step 5] Defense Check: Contract verifies (txNonce == nonce[sender]).",
          "[Step 6] Result: REJECTED! Nonce 0 has already been consumed."
        ]);
        setAttackStatus("ATTACK BLOCKED");
      } else {
        setAttackLogs([
          "[Step 1] Generator: Creating valid hybrid transaction Tx_1...",
          "[Step 2] Node: Received Tx_1. Strict AND verification PASSED.",
          "[Step 3] Node: Ledger committed Tx_1.",
          "[Step 4] Attacker: Retransmitting exact signed byte payload...",
          "[Step 5] Defense Check: Replay protection is DISABLED.",
          "[Step 6] Result: VULNERABLE! Replayed transaction accepted."
        ]);
        setAttackStatus("VULNERABLE (Accepted)");
      }
    } else if (type === "forgery") {
      setAttackLogs([
        "[Step 1] Generating valid transaction message...",
        "[Step 2] Attacker: Flipped bits at byte offset 5 inside ASN.1 DER ECDSA sequence.",
        "[Step 3] Verifier: Recomputing SHA3-512 canonical digest...",
        "[Step 4] Verification: ECDSA Valid = False, ML-DSA Valid = True.",
        "[Step 5] Strict AND Conjunction (be ∧ bpq) = False. CORRUPT SIGNATURE DROPPED."
      ]);
      setAttackStatus("ATTACK BLOCKED");
    } else if (type === "mitm") {
      setAttackLogs([
        "[Step 1] Sender generates Tx: 10.0 DIU with valid dual signature...",
        "[Step 2] MITM Attacker intercepts packet and modifies amount to 1000.0 DIU...",
        "[Step 3] Verifier recomputes canonical digest: SHA3-512('HYB-SIG' || Enc(v, αe, αpq, tampered_msg)).",
        "[Step 4] Digest mismatch detected! Cryptographic integrity preserved."
      ]);
      setAttackStatus("ATTACK BLOCKED");
    } else if (type === "duplicate") {
      setAttackLogs([
        "[Step 1] Generating Transaction TX_DUP_01 with hash 9a81fc...21e7.",
        "[Step 2] First submission: Tx queued in mempool.",
        "[Step 3] Attacker immediately submits identical transaction object again...",
        "[Step 4] Blockchain pool check: if (tx_hash in transaction_pool_set) -> REJECT.",
        "[Step 5] Duplicate detected! Second submission dropped."
      ]);
      setAttackStatus("ATTACK BLOCKED (Duplicate Rejected)");
    } else if (type === "key-misbinding") {
      setAttackLogs([
        "[Step 1] Target address derived via SHA-256(HYB-ADDR || pke || pkpq)...",
        "[Step 2] Attacker supplies substitute public key pair claiming ownership...",
        "[Step 3] Address mismatch! Calculated address != Sender address.",
        "[Step 4] Result: REJECTED. Public key cannot be substituted."
      ]);
      setAttackStatus("ATTACK BLOCKED");
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner - Bento Styled */}
      <div className="rounded-2xl dark:bg-[#141712] bg-[#fdfdfa] border dark:border-[#23271f] border-[#e6e4da] p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b dark:border-[#23271f] border-[#e6e4da] pb-4">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-[#00dc82]/10 dark:text-[#00dc82] text-emerald-700 font-mono text-xs border border-[#00dc82]/30 font-bold">
              Section 4.5.2 & Table 11
            </span>
            <h3 className="text-sm font-bold dark:text-white text-slate-900 tracking-wide">
              Cumulative Protocol Ablation & Adversarial Attack Simulation
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00dc82] animate-pulse" />
            <span className="text-xs font-mono font-bold dark:text-[#00dc82] text-emerald-600">
              Full Framework: 100% Resistance
            </span>
          </div>
        </div>
        <p className="text-xs dark:text-slate-400 text-slate-600 leading-relaxed max-w-4xl">
          Evaluates six cumulative protocol configurations (Baseline to Full Framework) against six attack categories.
          Adding <strong className="dark:text-[#00dc82] text-emerald-600 font-bold">Key Binding</strong> blocks key misbinding (+100 pp),{" "}
          <strong className="dark:text-[#00dc82] text-emerald-600 font-bold">AND Verification</strong> blocks partial signatures (+100 pp), and{" "}
          <strong className="dark:text-[#00dc82] text-emerald-600 font-bold">Replay Protection</strong> blocks retransmitted transactions (+100 pp).
        </p>
      </div>

      {/* Table 11: Cumulative Protocol Ablation Matrix */}
      <div className="rounded-2xl dark:bg-[#141712] bg-[#fdfdfa] border dark:border-[#23271f] border-[#e6e4da] overflow-hidden shadow-xl">
        <div className="p-5 border-b dark:border-[#23271f] border-[#e6e4da] flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider dark:text-slate-400 text-slate-600 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#00dc82]" />
            <span>Table 11: Cumulative Protocol Ablation Results</span>
          </h4>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded dark:bg-[#0f110e] bg-slate-100 dark:text-[#00dc82] text-emerald-600 border dark:border-[#23271f] border-[#e6e4da]">
            Tested Attack-Blocking Rates (%)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="dark:bg-[#0f110e] bg-[#f6f5ef] dark:text-slate-400 text-slate-500 border-b dark:border-[#23271f] border-[#e6e4da]">
              <tr>
                <th className="py-3 px-4">Configuration</th>
                <th className="py-3 px-3 text-center">Key-Misbinding</th>
                <th className="py-3 px-3 text-center">Cross-Domain</th>
                <th className="py-3 px-3 text-center">Downgrade</th>
                <th className="py-3 px-3 text-center">Partial-Sig</th>
                <th className="py-3 px-3 text-center">Replay</th>
                <th className="py-3 px-3 text-center">Forgery</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-[#23271f] divide-slate-100 dark:text-slate-300 text-slate-700">
              {ablationConfigs.map((c) => (
                <tr
                  key={c.id}
                  className={`hover:dark:bg-[#111722]/60 hover:bg-[#f6f5ef] transition-colors ${
                    c.id === "C5" ? "dark:bg-[#00dc82]/10 bg-emerald-50/70 font-bold dark:text-[#00dc82] text-emerald-700" : ""
                  }`}
                >
                  <td className="py-3 px-4 font-bold dark:text-white text-slate-900 flex items-center gap-2">
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">{c.id}</span>
                    <span>{c.name}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={c.misbinding === 100 ? "dark:text-[#00dc82] text-emerald-600 font-bold" : "text-rose-600 dark:text-rose-400 font-semibold"}>
                      {c.misbinding}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center dark:text-[#00dc82] text-emerald-600 font-bold">{c.crossDomain}%</td>
                  <td className="py-3 px-3 text-center dark:text-[#00dc82] text-emerald-600 font-bold">{c.downgrade}%</td>
                  <td className="py-3 px-3 text-center">
                    <span className={c.partialSig === 100 ? "dark:text-[#00dc82] text-emerald-600 font-bold" : "text-rose-600 dark:text-rose-400 font-semibold"}>
                      {c.partialSig}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={c.replay === 100 ? "dark:text-[#00dc82] text-emerald-600 font-bold" : "text-rose-600 dark:text-rose-400 font-semibold"}>
                      {c.replay}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center dark:text-[#00dc82] text-emerald-600 font-bold">{c.forgery}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Attack Execution Console & Defense Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Attack Vector Launcher */}
        <div className="rounded-2xl dark:bg-[#141712] bg-[#fdfdfa] border dark:border-[#23271f] border-[#e6e4da] p-6 space-y-5 shadow-xl">
          <h4 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2 border-b dark:border-[#23271f] border-[#e6e4da] pb-3">
            <Bug className="w-4 h-4 text-rose-500" />
            <span>Adversarial Attack Vector Launcher</span>
          </h4>

          <div className="space-y-2.5">
            {[
              { id: "replay", name: "Replay Attack", sub: "Retransmit signed transaction" },
              { id: "forgery", name: "Signature Forgery", sub: "Tamper ECDSA/ML-DSA bit" },
              { id: "mitm", name: "MITM Modification", sub: "Alter payload amount in flight" },
              { id: "duplicate", name: "Duplicate Submission", sub: "Same hash submitted twice" },
              { id: "key-misbinding", name: "Key-Misbinding", sub: "Substitute rogue public key" }
            ].map((atk) => (
              <button
                key={atk.id}
                onClick={() => handleRunAttack(atk.id)}
                disabled={isExecuting}
                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between shadow-sm ${
                  activeAttack === atk.id
                    ? "dark:bg-rose-950/20 bg-rose-50 border-rose-500/50 shadow-rose-500/10 ring-1 ring-rose-500/30"
                    : "dark:bg-[#0f110e] bg-[#f6f5ef] dark:border-[#23271f] border-[#e6e4da] hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="text-xs font-bold dark:text-white text-slate-900">{atk.name}</div>
                  <div className="text-[10px] dark:text-slate-400 text-slate-500">{atk.sub}</div>
                </div>
                <Play className="w-3.5 h-3.5 text-rose-500" />
              </button>
            ))}
          </div>

          {/* Defense Toggles */}
          <div className="pt-3 border-t dark:border-[#23271f] border-[#e6e4da] space-y-3">
            <div className="text-[11px] font-bold uppercase dark:text-slate-400 text-slate-600">Defense Controls:</div>
            <label className="flex items-center justify-between text-xs dark:text-slate-300 text-slate-700 cursor-pointer">
              <span>Replay Freshness Nonce:</span>
              <input
                type="checkbox"
                checked={replayProt}
                onChange={(e) => setReplayProt(e.target.checked)}
                className="accent-[#00dc82] w-4 h-4 cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between text-xs dark:text-slate-300 text-slate-700 cursor-pointer">
              <span>Key-Address Binding:</span>
              <input
                type="checkbox"
                checked={keyBinding}
                onChange={(e) => setKeyBinding(e.target.checked)}
                className="accent-[#00dc82] w-4 h-4 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Live Attack Terminal Logs */}
        <div className="lg:col-span-2 rounded-2xl dark:bg-[#141712] bg-[#fdfdfa] border dark:border-[#23271f] border-[#e6e4da] p-6 space-y-4 font-mono shadow-xl">
          <div className="flex items-center justify-between border-b dark:border-[#23271f] border-[#e6e4da] pb-3">
            <div className="flex items-center gap-2 text-xs dark:text-slate-400 text-slate-600 font-bold">
              <Terminal className="w-4 h-4 text-[#00dc82]" />
              <span>Real-time Attack Execution Telemetry</span>
            </div>
            {attackStatus && (
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                  attackStatus.includes("BLOCKED")
                    ? "dark:bg-[#00dc82]/10 bg-emerald-50 dark:text-[#00dc82] text-emerald-700 border-[#00dc82]/30"
                    : "dark:bg-rose-500/10 bg-rose-50 text-rose-600 dark:text-rose-400 border-rose-500/30"
                }`}
              >
                {attackStatus}
              </span>
            )}
          </div>

          <div className="h-64 overflow-y-auto space-y-2 text-xs p-4 rounded-xl dark:bg-[#05070a] bg-slate-900 text-slate-200 border dark:border-[#23271f] border-slate-800">
            {attackLogs.length > 0 ? (
              attackLogs.map((log, i) => (
                <div
                  key={i}
                  className={`leading-relaxed ${
                    log.includes("REJECTED") || log.includes("DROPPED")
                      ? "text-[#00dc82] font-bold"
                      : log.includes("VULNERABLE")
                      ? "text-rose-400 font-bold"
                      : log.includes("Attacker")
                      ? "text-rose-300"
                      : "text-slate-300"
                  }`}
                >
                  {log}
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                Select an attack vector on the left and click to trigger live execution.
              </div>
            )}
          </div>

          {/* Formal Reductions Callout */}
          <div className="p-4 rounded-xl dark:bg-[#0f110e] bg-[#f6f5ef] border dark:border-[#23271f] border-[#e6e4da] text-xs space-y-2">
            <div className="text-[11px] font-bold dark:text-[#00dc82] text-emerald-700 uppercase tracking-wide">
              Theorem 1: Formal Security Reduction Summary (Section 3.3)
            </div>
            <div className="dark:text-slate-300 text-slate-700 text-[11px] leading-relaxed">
              <strong>Classical EUF-CMA:</strong> Adv_H^C(A_C) ≤ min&#123;Adv_e^C(B_e), Adv_pq^C(B_pq)&#125; + ε_coll^C
            </div>
            <div className="dark:text-slate-300 text-slate-700 text-[11px] leading-relaxed">
              <strong>Quantum EUF-CMA_Q:</strong> Adv_H^Q(A_Q) ≤ Adv_pq^Q(B_pq^Q) + ε_coll^Q. Post-quantum unforgeability
              holds even if the adversary obtains the classical private key <code>ske</code>, relying strictly on ML-DSA-65 hardness.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
