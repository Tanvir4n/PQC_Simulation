"use client";

import React from "react";
import {
  Users,
  Key,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Link2,
  FileCode,
  CheckCircle2,
  XCircle,
  GitBranch,
  Layers,
  Database,
  Gauge,
  Boxes,
  Network,
  ArrowDown,
  Info,
  ChevronRight,
  Sparkles,
  Lock,
  Cpu
} from "lucide-react";
import { ActiveNavTab } from "@/components/navigation/AgentShieldHeader";

export interface SimulationState {
  currentStep: number; // 0 to 6
  isRunning: boolean;
  scenarioId: string;
  ecdsaValid: boolean;
  mldsaValid: boolean;
  strictAndPassed: boolean;
  rejectionReason?: string;
  txHash: string;
  blockNumber: number;
}

interface ArchitectureCanvasProps {
  onSelectNode: (nodeId: string) => void;
  selectedNodeId: string | null;
  simulationState: SimulationState;
  onNavigateTab: (tab: ActiveNavTab) => void;
}

export const ArchitectureCanvas: React.FC<ArchitectureCanvasProps> = ({
  onSelectNode,
  selectedNodeId,
  simulationState,
  onNavigateTab
}) => {
  const { currentStep, isRunning, ecdsaValid, mldsaValid, strictAndPassed, scenarioId } = simulationState;

  // Active step highlights
  const isStep1Active = currentStep === 1;
  const isStep2Active = currentStep === 2;
  const isStep3Active = currentStep === 3;
  const isStep4Active = currentStep === 4 || currentStep >= 5;
  const isStep5Active = currentStep === 5 || currentStep === 6;

  // Verification results when evaluated
  const isEvaluated = currentStep >= 4;
  const isAccepted = isEvaluated && strictAndPassed;
  const isRejected = isEvaluated && !strictAndPassed;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center select-none font-sans transition-all duration-300">
      {/* ─── Top Diagram Frame ─── */}
      <div className="w-full rounded-3xl dark:bg-[#070a0f] bg-white border dark:border-[#1a2332] border-[#E6E8E5] p-5 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle dot matrix grid background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
          style={{
            backgroundImage: "radial-gradient(#777B78 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}
        />

        {/* Header Title Section */}
        <div className="relative z-10 mb-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b dark:border-[#161f2d] border-[#E6E8E5] pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight dark:text-white text-[#202124]">
                PQC Blockchain Framework
              </h2>
              <p className="text-xs font-mono font-semibold text-[#777B78] uppercase tracking-wider mt-0.5">
                PROPOSED SYSTEM ARCHITECTURE · HIGH-LEVEL OVERVIEW
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full dark:bg-[#121924] bg-[#F8F8F5] border dark:border-[#1e2736] border-[#E6E8E5] text-[#777B78] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00dc82] animate-pulse" />
                <span>Interactive Live Canvas</span>
              </span>
            </div>
          </div>
        </div>

        {/* ─── SECTION 1: BLOCKCHAIN NETWORK & TX GENERATION ─── */}
        <div className="relative z-10 flex flex-col items-center">
          <div
            onClick={() => onSelectNode("tx-generator")}
            role="button"
            tabIndex={0}
            className={`w-full max-w-2xl rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all duration-200 border ${
              selectedNodeId === "tx-generator"
                ? "ring-2 ring-[#00dc82] dark:bg-[#0c131d] bg-emerald-50/50 border-[#00dc82]"
                : isStep1Active
                ? "ring-2 ring-emerald-400 dark:bg-[#0c131d] bg-emerald-50/40 border-emerald-400"
                : "dark:bg-[#0c121c] bg-[#F8F8F5] hover:bg-slate-50 dark:hover:bg-[#111824] dark:border-[#1c2738] border-[#E6E8E5]"
            } shadow-xs hover:shadow-md group`}
          >
            <div className="flex justify-center mb-2">
              <div className="w-9 h-9 rounded-xl dark:bg-[#15202e] bg-blue-50 dark:border-[#223347] border-blue-200 border flex items-center justify-center text-blue-500 group-hover:scale-105 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-sm sm:text-base font-bold dark:text-white text-[#202124]">
              1. Blockchain Network & Transaction Generation
            </h3>
            <p className="text-xs font-mono text-[#777B78] mt-1">
              Sender · Receiver · Amount · Timestamp · Transaction ID
            </p>
          </div>

          {/* Connector Arrow 1 -> 2 */}
          <div className="py-2.5 flex flex-col items-center text-[#777B78]">
            <ArrowDown className={`w-4 h-4 ${isStep1Active ? "text-[#00dc82] animate-bounce" : ""}`} />
          </div>

          {/* ─── SECTION 2: HYBRID KEY GENERATION ─── */}
          <div className="w-full max-w-2xl rounded-2xl dark:bg-[#0a0f18] bg-white border dark:border-[#1c2738] border-[#E6E8E5] p-4 sm:p-5 shadow-xs">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#777B78] mb-3 flex items-center justify-between">
              <span>2. Hybrid Key Generation</span>
              <span className="text-[10px] text-slate-400 lowercase">independent keypairs</span>
            </div>

            {/* Parallel Branches: Classical & Post-Quantum */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {/* Branch 1: ECDSA */}
              <div
                onClick={() => onSelectNode("ecdsa-keygen")}
                role="button"
                tabIndex={0}
                className={`rounded-xl p-3.5 cursor-pointer border transition-all ${
                  selectedNodeId === "ecdsa-keygen"
                    ? "ring-2 ring-blue-500 dark:bg-blue-950/20 bg-blue-50/60 border-blue-500"
                    : isStep2Active
                    ? "ring-1 ring-blue-400 dark:bg-blue-950/20 bg-blue-50/40 border-blue-400"
                    : "dark:bg-[#0e1622] bg-[#F8F8F5] dark:border-[#1a2536] border-[#E6E8E5] hover:border-blue-300 dark:hover:border-blue-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm dark:text-white text-[#202124]">ECDSA</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-500/30">
                    Classical
                  </span>
                </div>
                <div className="text-xs font-mono text-[#777B78] mt-1">secp256k1 · RFC 6979</div>
                <div className="text-[11px] text-[#777B78] mt-1.5">pk_e (65B) · sk_e (32B)</div>
              </div>

              {/* Branch 2: ML-DSA-65 */}
              <div
                onClick={() => onSelectNode("mldsa-keygen")}
                role="button"
                tabIndex={0}
                className={`rounded-xl p-3.5 cursor-pointer border transition-all ${
                  selectedNodeId === "mldsa-keygen"
                    ? "ring-2 ring-[#00dc82] dark:bg-emerald-950/20 bg-emerald-50/60 border-[#00dc82]"
                    : isStep2Active
                    ? "ring-1 ring-emerald-400 dark:bg-emerald-950/20 bg-emerald-50/40 border-emerald-400"
                    : "dark:bg-[#0e1622] bg-[#F8F8F5] dark:border-[#1a2536] border-[#E6E8E5] hover:border-emerald-300 dark:hover:border-emerald-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm dark:text-white text-[#202124]">ML-DSA-65</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-500/30">
                    Post-Quantum
                  </span>
                </div>
                <div className="text-xs font-mono text-[#777B78] mt-1">FIPS 204 (Level 3)</div>
                <div className="text-[11px] text-[#777B78] mt-1.5">pk_pq (1,952B) · sk_pq (4,032B)</div>
              </div>
            </div>

            {/* Dual Public-Key Binding Node */}
            <div className="flex justify-center my-1.5">
              <Link2 className="w-4 h-4 text-[#777B78]" />
            </div>

            <div
              onClick={() => onSelectNode("dual-key-binding")}
              role="button"
              tabIndex={0}
              className={`rounded-xl p-3 text-center cursor-pointer border transition-all ${
                selectedNodeId === "dual-key-binding"
                  ? "ring-2 ring-purple-500 dark:bg-purple-950/20 bg-purple-50/60 border-purple-500"
                  : isStep2Active
                  ? "ring-1 ring-purple-400 dark:bg-purple-950/20 bg-purple-50/40 border-purple-400"
                  : "dark:bg-[#0e1622] bg-[#F8F8F5] dark:border-[#1a2536] border-[#E6E8E5] hover:border-purple-300"
              }`}
            >
              <div className="font-bold text-xs sm:text-sm dark:text-white text-[#202124]">
                Dual Public-Key Binding
              </div>
              <div className="text-[11px] font-mono text-[#777B78] mt-0.5">
                SHA-256 · Hybrid Blockchain Address Addr = Trunc_160(SHA256(HYB-ADDR || pk_e || pk_pq))
              </div>
            </div>
          </div>

          {/* Connector Arrow 2 -> 3 */}
          <div className="py-2.5 flex flex-col items-center text-[#777B78]">
            <ArrowDown className={`w-4 h-4 ${isStep2Active ? "text-[#00dc82] animate-bounce" : ""}`} />
          </div>

          {/* ─── SECTION 3: HYBRID DIGITAL SIGNATURE ─── */}
          <div className="w-full max-w-2xl rounded-2xl dark:bg-[#0a0f18] bg-white border dark:border-[#1c2738] border-[#E6E8E5] p-4 sm:p-5 shadow-xs">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#777B78] mb-3 flex items-center justify-between">
              <span>3. Hybrid Digital Signature</span>
              <span className="text-[10px] text-slate-400 lowercase">canonical signed context</span>
            </div>

            {/* Canonical Signed Context Top Banner */}
            <div
              onClick={() => onSelectNode("canonical-context")}
              role="button"
              tabIndex={0}
              className={`rounded-xl p-3.5 mb-3 cursor-pointer border transition-all ${
                selectedNodeId === "canonical-context"
                  ? "ring-2 ring-indigo-500 dark:bg-indigo-950/20 bg-indigo-50/60 border-indigo-500"
                  : isStep3Active
                  ? "ring-1 ring-indigo-400 dark:bg-indigo-950/20 bg-indigo-50/40 border-indigo-400"
                  : "dark:bg-[#131b27] bg-[#F1F3F5] dark:border-[#1f2b3e] border-[#E2E5E8] hover:border-indigo-300"
              }`}
            >
              <div className="font-bold text-xs sm:text-sm dark:text-white text-[#202124] flex items-center justify-between">
                <span>Canonical Signed Context</span>
                <span className="text-[10px] font-mono font-bold text-indigo-500">SHA3-512</span>
              </div>
              <div className="text-[11px] text-[#777B78] mt-0.5">
                Version (0x01) + Algorithm Identifiers + Public Keys + Transaction Message
              </div>
              <div className="text-[10px] font-mono text-[#777B78] mt-1">
                d = SHA3-512(HYB-SIG: || Enc(v, α_e, α_pq, m))
              </div>
            </div>

            {/* Parallel Signing Branches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {/* ECDSA Sign */}
              <div
                onClick={() => onSelectNode("ecdsa-sign")}
                role="button"
                tabIndex={0}
                className={`rounded-xl p-3 cursor-pointer border transition-all ${
                  selectedNodeId === "ecdsa-sign"
                    ? "ring-2 ring-blue-500 dark:bg-blue-950/20 bg-blue-50/60 border-blue-500"
                    : isStep3Active
                    ? "ring-1 ring-blue-400 dark:bg-blue-950/20 bg-blue-50/40 border-blue-400"
                    : "dark:bg-[#0e1622] bg-[#F8F8F5] dark:border-[#1a2536] border-[#E6E8E5]"
                }`}
              >
                <div className="font-bold text-xs sm:text-sm dark:text-white text-[#202124]">ECDSA Sign</div>
                <div className="text-[11px] text-[#777B78] mt-0.5">Classical signature σ_e</div>
                <div className="text-[10px] font-mono text-blue-500 mt-1">DER (r,s) ~70 Bytes</div>
              </div>

              {/* ML-DSA Sign */}
              <div
                onClick={() => onSelectNode("mldsa-sign")}
                role="button"
                tabIndex={0}
                className={`rounded-xl p-3 cursor-pointer border transition-all ${
                  selectedNodeId === "mldsa-sign"
                    ? "ring-2 ring-[#00dc82] dark:bg-emerald-950/20 bg-emerald-50/60 border-[#00dc82]"
                    : isStep3Active
                    ? "ring-1 ring-emerald-400 dark:bg-emerald-950/20 bg-emerald-50/40 border-emerald-400"
                    : "dark:bg-[#0e1622] bg-[#F8F8F5] dark:border-[#1a2536] border-[#E6E8E5]"
                }`}
              >
                <div className="font-bold text-xs sm:text-sm dark:text-white text-[#202124]">ML-DSA Sign</div>
                <div className="text-[11px] text-[#777B78] mt-0.5">PQC signature σ_pq</div>
                <div className="text-[10px] font-mono text-emerald-500 mt-1">Fixed 3,309 Bytes</div>
              </div>
            </div>

            {/* Connector to Assembly */}
            <div className="flex justify-center my-1 text-[#777B78]">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>

            {/* Hybrid Signature Assembly */}
            <div
              onClick={() => onSelectNode("hybrid-assembly")}
              role="button"
              tabIndex={0}
              className={`rounded-xl p-3 text-center cursor-pointer border transition-all ${
                selectedNodeId === "hybrid-assembly"
                  ? "ring-2 ring-purple-500 dark:bg-purple-950/20 bg-purple-50/60 border-purple-500"
                  : isStep3Active
                  ? "ring-1 ring-purple-400 dark:bg-purple-950/20 bg-purple-50/40 border-purple-400"
                  : "dark:bg-[#0e1622] bg-[#F8F8F5] dark:border-[#1a2536] border-[#E6E8E5]"
              }`}
            >
              <div className="font-bold text-xs sm:text-sm dark:text-white text-[#202124]">
                Hybrid Signature Assembly
              </div>
              <div className="text-[11px] font-mono text-[#777B78] mt-0.5">
                Σ = v (1B) || DER(r,s) (70B) || σ_pq (3,309B) = <span className="font-bold text-purple-600 dark:text-purple-400">3,380 Bytes</span>
              </div>
            </div>
          </div>

          {/* Connector Arrow 3 -> 4 */}
          <div className="py-2.5 flex flex-col items-center text-[#777B78]">
            <ArrowDown className={`w-4 h-4 ${isStep3Active ? "text-[#00dc82] animate-bounce" : ""}`} />
          </div>

          {/* ─── SECTION 4: HYBRID SIGNATURE VERIFICATION (GATEWAY) ─── */}
          <div className="w-full max-w-2xl rounded-2xl dark:bg-[#0a0f18] bg-white border dark:border-[#1c2738] border-[#E6E8E5] p-4 sm:p-5 shadow-xs relative">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#777B78] mb-3 flex items-center justify-between">
              <span>4. Hybrid Signature Verification</span>
              <span className="text-[10px] text-slate-400 lowercase">zero-compromise conjunction</span>
            </div>

            {/* Two Verification Checks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {/* Check 1: ECDSA Verify */}
              <div
                onClick={() => onSelectNode("ecdsa-verify")}
                role="button"
                tabIndex={0}
                className={`rounded-xl p-3.5 cursor-pointer border transition-all ${
                  selectedNodeId === "ecdsa-verify"
                    ? "ring-2 ring-blue-500 dark:bg-blue-950/20 bg-blue-50/60 border-blue-500"
                    : isEvaluated
                    ? ecdsaValid
                      ? "ring-1 ring-emerald-500 dark:bg-emerald-950/20 bg-emerald-50/30 border-emerald-500/40"
                      : "ring-1 ring-rose-500 dark:bg-rose-950/20 bg-rose-50/30 border-rose-500/40"
                    : "dark:bg-[#0e1622] bg-[#F8F8F5] dark:border-[#1a2536] border-[#E6E8E5]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm dark:text-white text-[#202124]">ECDSA Verify</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 font-semibold">
                    Check 1
                  </span>
                </div>
                <div className="text-xs font-mono text-[#777B78] mt-1">b_e ∈ &#123;0, 1&#125;</div>
                {isEvaluated && (
                  <div className="mt-1.5 flex items-center gap-1 text-[11px] font-mono font-bold">
                    {ecdsaValid ? (
                      <span className="text-[#00dc82] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> b_e = 1 (VALID)
                      </span>
                    ) : (
                      <span className="text-rose-500 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> b_e = 0 (FAILED)
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Check 2: ML-DSA Verify */}
              <div
                onClick={() => onSelectNode("mldsa-verify")}
                role="button"
                tabIndex={0}
                className={`rounded-xl p-3.5 cursor-pointer border transition-all ${
                  selectedNodeId === "mldsa-verify"
                    ? "ring-2 ring-[#00dc82] dark:bg-emerald-950/20 bg-emerald-50/60 border-[#00dc82]"
                    : isEvaluated
                    ? mldsaValid
                      ? "ring-1 ring-emerald-500 dark:bg-emerald-950/20 bg-emerald-50/30 border-emerald-500/40"
                      : "ring-1 ring-rose-500 dark:bg-rose-950/20 bg-rose-50/30 border-rose-500/40"
                    : "dark:bg-[#0e1622] bg-[#F8F8F5] dark:border-[#1a2536] border-[#E6E8E5]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm dark:text-white text-[#202124]">ML-DSA Verify</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold">
                    Check 2
                  </span>
                </div>
                <div className="text-xs font-mono text-[#777B78] mt-1">b_pq ∈ &#123;0, 1&#125;</div>
                {isEvaluated && (
                  <div className="mt-1.5 flex items-center gap-1 text-[11px] font-mono font-bold">
                    {mldsaValid ? (
                      <span className="text-[#00dc82] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> b_pq = 1 (VALID)
                      </span>
                    ) : (
                      <span className="text-rose-500 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> b_pq = 0 (FAILED)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Strict AND Verification Label with branch icon */}
            <div className="flex justify-center my-1.5">
              <GitBranch className="w-4 h-4 text-[#777B78] rotate-90" />
            </div>

            <div
              onClick={() => onSelectNode("strict-and")}
              role="button"
              tabIndex={0}
              className={`rounded-xl p-2.5 text-center cursor-pointer border mb-3 transition-all ${
                selectedNodeId === "strict-and"
                  ? "ring-2 ring-indigo-500 dark:bg-indigo-950/20 bg-indigo-50/60 border-indigo-500"
                  : "dark:bg-[#0e1622] bg-[#F8F8F5] dark:border-[#1a2536] border-[#E6E8E5]"
              }`}
            >
              <div className="font-bold text-xs sm:text-sm dark:text-white text-[#202124]">
                Strict AND Verification
              </div>
              <div className="text-[11px] font-mono text-[#777B78] mt-0.5">
                Both signatures must be valid · b_final = b_e ∧ b_pq
              </div>
            </div>

            {/* Decision Outcome Boxes: ACCEPT & REJECT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* ACCEPT Box */}
              <div
                onClick={() => onSelectNode("decision-accept")}
                role="button"
                tabIndex={0}
                className={`rounded-xl p-3.5 cursor-pointer border transition-all ${
                  isAccepted
                    ? "ring-2 ring-[#00dc82] dark:bg-emerald-950/40 bg-emerald-50 dark:border-[#00dc82] border-emerald-500 shadow-md shadow-emerald-500/10"
                    : isRejected
                    ? "opacity-35 dark:bg-[#0a0f16] bg-slate-50 border-slate-200 dark:border-slate-800"
                    : selectedNodeId === "decision-accept"
                    ? "ring-2 ring-[#00dc82] border-[#00dc82]"
                    : "dark:bg-[#07130f] bg-emerald-50/30 dark:border-emerald-900/30 border-emerald-200/60 hover:border-emerald-400"
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    className={`w-4 h-4 ${isAccepted ? "text-[#00dc82]" : "text-emerald-600 dark:text-emerald-500"}`}
                  />
                  <span className="font-extrabold text-sm text-emerald-700 dark:text-emerald-400">ACCEPT</span>
                </div>
                <div className="text-xs text-[#777B78] mt-1 font-mono">Both valid (b_final = 1)</div>
              </div>

              {/* REJECT Box */}
              <div
                onClick={() => onSelectNode("decision-reject")}
                role="button"
                tabIndex={0}
                className={`rounded-xl p-3.5 cursor-pointer border transition-all ${
                  isRejected
                    ? "ring-2 ring-rose-500 dark:bg-rose-950/40 bg-rose-50 dark:border-rose-500 border-rose-500 shadow-md shadow-rose-500/10"
                    : isAccepted
                    ? "opacity-35 dark:bg-[#0a0f16] bg-slate-50 border-slate-200 dark:border-slate-800"
                    : selectedNodeId === "decision-reject"
                    ? "ring-2 ring-rose-500 border-rose-500"
                    : "dark:bg-[#150a0a] bg-rose-50/30 dark:border-rose-900/30 border-rose-200/60 hover:border-rose-400"
                }`}
              >
                <div className="flex items-center gap-2">
                  <XCircle
                    className={`w-4 h-4 ${isRejected ? "text-rose-500" : "text-rose-600 dark:text-rose-400"}`}
                  />
                  <span className="font-extrabold text-sm text-rose-700 dark:text-rose-400">REJECT</span>
                </div>
                <div className="text-xs text-[#777B78] mt-1 font-mono">Either invalid (b_final = 0)</div>
              </div>
            </div>
          </div>

          {/* Connector Arrow 4 -> 5 */}
          <div className="py-2.5 flex flex-col items-center text-[#777B78]">
            <ArrowDown className={`w-4 h-4 ${isStep4Active ? "text-[#00dc82] animate-bounce" : ""}`} />
          </div>

          {/* ─── SECTION 5: BLOCKCHAIN PROCESSING ─── */}
          <div
            onClick={() => onSelectNode("block-formation")}
            role="button"
            tabIndex={0}
            className={`w-full max-w-2xl rounded-2xl p-4 sm:p-5 cursor-pointer border transition-all duration-200 ${
              selectedNodeId === "block-formation" || selectedNodeId === "mempool" || selectedNodeId === "merkle-tree"
                ? "ring-2 ring-amber-500 dark:bg-amber-950/20 bg-amber-50/60 border-amber-500"
                : isStep5Active && isAccepted
                ? "ring-1 ring-emerald-400 dark:bg-emerald-950/20 bg-emerald-50/30 border-emerald-400"
                : isStep5Active && isRejected
                ? "opacity-60 ring-1 ring-rose-400 dark:bg-rose-950/10 bg-rose-50/20 border-rose-400"
                : "dark:bg-[#0a0f18] bg-white dark:border-[#1c2738] border-[#E6E8E5] hover:bg-slate-50 dark:hover:bg-[#111824]"
            } shadow-xs hover:shadow-md`}
          >
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#777B78] mb-2 flex items-center justify-between">
              <span>5. Blockchain Processing</span>
              <span className="text-[10px] text-amber-500 font-mono">Mempool & Ledger</span>
            </div>

            <div className="text-xs font-mono text-[#202124] dark:text-slate-300 flex flex-wrap items-center justify-center gap-1.5 py-1 text-center">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80">Transaction Pool</span>
              <span className="text-[#777B78]">→</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80">Duplicate Detection</span>
              <span className="text-[#777B78]">→</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80">Block Formation</span>
              <span className="text-[#777B78]">→</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80">Merkle Root</span>
              <span className="text-[#777B78]">→</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80">Block Validation</span>
              <span className="text-[#777B78]">→</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
                Ledger Update
              </span>
            </div>
          </div>

          {/* Connector Arrow 5 -> 6 */}
          <div className="py-2.5 flex flex-col items-center text-[#777B78]">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* ─── SECTION 6: INDEPENDENT EVALUATION MODULES ─── */}
          <div className="w-full max-w-2xl rounded-2xl dark:bg-[#0a0f18] bg-white border dark:border-[#1c2738] border-[#E6E8E5] p-4 sm:p-5 shadow-xs">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#777B78] mb-3 flex items-center justify-between">
              <span>6. Independent Evaluation Modules</span>
              <span className="text-[10px] text-slate-400 lowercase">click to explore research views</span>
            </div>

            {/* 2x2 Evaluation Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Module 1: Security Analysis */}
              <div
                onClick={() => {
                  onSelectNode("module-security");
                  onNavigateTab("security");
                }}
                role="button"
                tabIndex={0}
                className="rounded-xl p-3.5 cursor-pointer dark:bg-[#0e1622] bg-[#F8F8F5] border dark:border-[#1a2536] border-[#E6E8E5] hover:border-emerald-400 dark:hover:border-emerald-600 transition-all group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#00dc82] group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm dark:text-white text-[#202124]">Security Analysis</span>
                </div>
                <p className="text-[11px] font-mono text-[#777B78]">
                  Forgery · Replay · MITM · Quantum threat
                </p>
                <div className="mt-2 text-[10px] font-mono text-[#00dc82] flex items-center gap-1 font-semibold">
                  <span>View Ablation C0-C5</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Module 2: Performance */}
              <div
                onClick={() => {
                  onSelectNode("module-performance");
                  onNavigateTab("cryptography");
                }}
                role="button"
                tabIndex={0}
                className="rounded-xl p-3.5 cursor-pointer dark:bg-[#0e1622] bg-[#F8F8F5] border dark:border-[#1a2536] border-[#E6E8E5] hover:border-blue-400 dark:hover:border-blue-600 transition-all group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Gauge className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm dark:text-white text-[#202124]">Performance</span>
                </div>
                <p className="text-[11px] font-mono text-[#777B78]">
                  KeyGen · Signing · Verification · TPS
                </p>
                <div className="mt-2 text-[10px] font-mono text-blue-500 flex items-center gap-1 font-semibold">
                  <span>View 1,000-Run Benchmark</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Module 3: Migration */}
              <div
                onClick={() => {
                  onSelectNode("module-migration");
                  onNavigateTab("migration");
                }}
                role="button"
                tabIndex={0}
                className="rounded-xl p-3.5 cursor-pointer dark:bg-[#0e1622] bg-[#F8F8F5] border dark:border-[#1a2536] border-[#E6E8E5] hover:border-purple-400 dark:hover:border-purple-600 transition-all group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <GitBranch className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm dark:text-white text-[#202124]">Migration</span>
                </div>
                <p className="text-[11px] font-mono text-[#777B78]">
                  Seven phases · Compatibility
                </p>
                <div className="mt-2 text-[10px] font-mono text-purple-500 flex items-center gap-1 font-semibold">
                  <span>View P1-P7 & 75.4% Trough</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Module 4: EVM Integration */}
              <div
                onClick={() => {
                  onSelectNode("module-evm");
                  onNavigateTab("evm");
                }}
                role="button"
                tabIndex={0}
                className="rounded-xl p-3.5 cursor-pointer dark:bg-[#0e1622] bg-[#F8F8F5] border dark:border-[#1a2536] border-[#E6E8E5] hover:border-amber-400 dark:hover:border-amber-600 transition-all group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Boxes className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm dark:text-white text-[#202124]">EVM Integration</span>
                </div>
                <p className="text-[11px] font-mono text-[#777B78]">
                  Anvil · Web3.py · HybridAuth · Gas
                </p>
                <div className="mt-2 text-[10px] font-mono text-amber-500 flex items-center gap-1 font-semibold">
                  <span>View Solidity & 70,442 Gas</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
