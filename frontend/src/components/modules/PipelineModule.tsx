"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Shield,
  ShieldAlert,
  Zap,
  Terminal,
  Cpu,
  Network,
  Layers,
  KeyRound,
  FileCode,
  Flame,
  Check,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Info
} from "lucide-react";
import { simulatePipeline, PipelineSimulationResult } from "@/lib/api";

interface PipelineModuleProps {
  isLiveMode: boolean;
}

const STAGE_METADATA = [
  {
    num: 1,
    id: "creation",
    title: "Tx Creation",
    subtitle: "Payload & Nonce",
    icon: FileCode,
    color: "#38bdf8",
    desc: "Canonical transaction payload serialization: (sender, receiver, value, nonce, chain_id)."
  },
  {
    num: 2,
    id: "keygen",
    title: "Dual KeyGen",
    subtitle: "Algorithm 1",
    icon: KeyRound,
    color: "#a855f7",
    desc: "Independent generation of ECDSA secp256k1 (65B) + ML-DSA-65 (1,952B) bound into a 2,017B public key."
  },
  {
    num: 3,
    id: "signing",
    title: "Hybrid Signing",
    subtitle: "Algorithm 2",
    icon: Shield,
    color: "#00dc82",
    desc: "Dual signing under SHA3-512('HYB-SIG') producing the canonical 3,380-byte byte envelope."
  },
  {
    num: 4,
    id: "network",
    title: "P2P Propagation",
    subtitle: "100-Node Mesh",
    icon: Network,
    color: "#06b6d4",
    desc: "Packet gossip across shortest-path routing hops with 3,380B payload bandwidth tracking."
  },
  {
    num: 5,
    id: "mempool",
    title: "Mempool Guard",
    subtitle: "Anti-Replay Filter",
    icon: Layers,
    color: "#f59e0b",
    desc: "Deduplication pool check and strict account nonce validation preventing double-spend and replay."
  },
  {
    num: 6,
    id: "verification",
    title: "Strict AND Gate",
    subtitle: "Algorithm 3",
    icon: Zap,
    color: "#10b981",
    desc: "Zero-compromise conjunction verification: b_final = b_e ∧ b_pq. Rejects if either fails."
  },
  {
    num: 7,
    id: "consensus",
    title: "Block Mining",
    subtitle: "SHA3-512 Merkle",
    icon: Cpu,
    color: "#6366f1",
    desc: "Batch aggregation into candidate block, hierarchical SHA3-512 Merkle tree sealing, and consensus proof."
  },
  {
    num: 8,
    id: "evm",
    title: "EVM Finalization",
    subtitle: "HybridAuth.sol",
    icon: Flame,
    color: "#ec4899",
    desc: "On-chain state transition execution in Anvil EVM, gas consumption (70,442 gas), and receipt emission."
  }
];

export const PipelineModule: React.FC<PipelineModuleProps> = ({ isLiveMode }) => {
  // Inputs
  const [sender, setSender] = useState<string>("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  const [receiver, setReceiver] = useState<string>("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
  const [amount, setAmount] = useState<number>(12.5);
  const [tamperMode, setTamperMode] = useState<string>("none");

  // State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [simulationResult, setSimulationResult] = useState<PipelineSimulationResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedStageTab, setSelectedStageTab] = useState<number>(1);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState<number>(750);

  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (msg: string) => {
    const timestamp = new Date().toISOString().substring(11, 23);
    setLogs((prev) => [...prev, `[${timestamp}] ${msg}`]);
  };

  const handleStartSimulation = async () => {
    setIsRunning(true);
    setCurrentStep(1);
    setSelectedStageTab(1);
    setLogs([]);
    addLog(`Initiating End-to-End Hybrid Transaction Lifecycle...`);
    addLog(`Parameters: Amount=${amount} ETH | Mode=${tamperMode.toUpperCase()}`);

    try {
      const result = await simulatePipeline({
        sender,
        receiver,
        amount,
        tamper_mode: tamperMode
      });
      setSimulationResult(result);

      for (let s = 1; s <= 8; s++) {
        setCurrentStep(s);
        setSelectedStageTab(s);
        const stageData = result.stages.find((st) => st.stage_num === s);

        if (!stageData) {
          addLog(`Pipeline terminated early at Stage ${result.rejected_at_stage || s - 1}.`);
          break;
        }

        addLog(`>> Stage ${s}: ${stageData.name} - ${stageData.status} (${stageData.duration_ms} ms)`);

        if (stageData.status === "REJECTED" || stageData.status === "FAILED_VERIFICATION") {
          addLog(`❌ Security Gate Triggered: ${result.error_message || "Rejection occurred"}`);
          break;
        }

        if (s < 8 && result.success) {
          await new Promise((r) => setTimeout(r, autoPlaySpeed));
        }
      }

      if (result.success) {
        addLog(`✅ Transaction Successfully Confirmed & Finalized in Block #${result.summary?.block_index}!`);
        addLog(`Gas Metered: ${result.summary?.gas_used?.toLocaleString()} Gas | Envelope: 3,380 Bytes`);
      } else {
        addLog(`⛔ Simulation Halt: Transaction was safely rejected by the QuantumResist protocol.`);
      }
    } catch (err: any) {
      addLog(`Error executing pipeline: ${err?.message || err}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setSimulationResult(null);
    setSelectedStageTab(1);
    setLogs([]);
    addLog(`Pipeline reset to initial standby state.`);
  };

  const activeStageData = simulationResult?.stages.find((s) => s.stage_num === selectedStageTab);
  const activeMeta = STAGE_METADATA.find((m) => m.num === selectedStageTab) || STAGE_METADATA[0];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. Header Banner */}
      <div className="rounded-3xl dark:bg-[#141712] bg-[#fdfdfa] border dark:border-[#23271f] border-[#e6e4da] p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00dc82] animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00dc82]">
              Unified Master Pipeline Simulator
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md dark:bg-[#1c2019] bg-slate-100 text-slate-400 border dark:border-[#30352b] border-[#e6e4da]">
              Stages 01 → 08
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight dark:text-white text-slate-900">
            End-to-End Hybrid Transaction Lifecycle
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Simulate a transaction from cryptographic payload creation, dual key binding, 3,380B envelope serialization,
            P2P mesh routing, strict conjunction verification, to EVM on-chain state finalization in one place.
          </p>
        </div>

        {/* Global Status Pill */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div
            className={`px-4 py-2 rounded-2xl border font-mono text-xs font-bold flex items-center gap-2 shadow-xs ${
              simulationResult?.success
                ? "dark:bg-emerald-500/10 bg-emerald-50 text-emerald-600 border-emerald-500/30"
                : simulationResult?.overall_status && !simulationResult.success
                ? "dark:bg-rose-500/10 bg-rose-50 text-rose-500 border-rose-500/30"
                : isRunning
                ? "dark:bg-cyan-500/10 bg-cyan-50 text-cyan-600 border-cyan-500/30 animate-pulse"
                : "dark:bg-[#1c2019] bg-slate-100 text-slate-400 border-slate-300 dark:border-slate-800"
            }`}
          >
            {simulationResult?.success ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>CONFIRMED & FINALIZED (0x1)</span>
              </>
            ) : simulationResult?.overall_status && !simulationResult.success ? (
              <>
                <XCircle className="w-4 h-4 text-rose-500" />
                <span>REJECTED AT STAGE {simulationResult.rejected_at_stage}</span>
              </>
            ) : isRunning ? (
              <>
                <Zap className="w-4 h-4 text-cyan-400 animate-bounce" />
                <span>EXECUTING STAGE 0{currentStep}...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-400" />
                <span>READY TO SIMULATE</span>
              </>
            )}
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Paper Ground-Truth: Algorithms 1, 2, 3 & Tables 4, 12
          </span>
        </div>
      </div>

      {/* 2. Interactive Controls & Attack Scenario Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Transaction Parameters (Span 7) */}
        <div className="lg:col-span-7 rounded-3xl dark:bg-[#141712] bg-[#fdfdfa] border dark:border-[#23271f] border-[#e6e4da] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b dark:border-[#23271f] border-[#e6e4da] pb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold dark:text-slate-300 text-slate-700">
              <FileCode className="w-4 h-4 text-[#00dc82]" />
              <span>TRANSACTION PAYLOAD PARAMETERS</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Chain ID: 31337 (Anvil)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="dark:text-slate-400 text-slate-600 text-[11px]">Sender Address (Alice)</label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#1c2019] bg-[#f6f5ef] border dark:border-[#30352b] border-[#e6e4da] dark:text-white text-slate-900 font-mono text-[11px] focus:outline-none focus:border-[#00dc82]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="dark:text-slate-400 text-slate-600 text-[11px]">Receiver Address (Bob)</label>
              <input
                type="text"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#1c2019] bg-[#f6f5ef] border dark:border-[#30352b] border-[#e6e4da] dark:text-white text-slate-900 font-mono text-[11px] focus:outline-none focus:border-[#00dc82]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <label className="text-xs font-mono dark:text-slate-400 text-slate-600">Amount:</label>
              <div className="flex items-center gap-1.5">
                {[1.0, 5.0, 12.5, 50.0].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(val)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
                      amount === val
                        ? "bg-[#00dc82]/15 border-[#00dc82] text-[#00dc82] font-bold"
                        : "dark:bg-[#1c2019] bg-slate-100 dark:border-[#30352b] border-[#e6e4da] text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {val} ETH
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="dark:text-slate-400 text-slate-600">Speed:</span>
              <select
                value={autoPlaySpeed}
                onChange={(e) => setAutoPlaySpeed(Number(e.target.value))}
                className="px-2.5 py-1 rounded-lg dark:bg-[#1c2019] bg-slate-100 border dark:border-[#30352b] border-[#e6e4da] dark:text-slate-200 text-slate-700 text-xs font-mono focus:outline-none"
              >
                <option value={1200}>Slow (1.2s)</option>
                <option value={750}>Normal (750ms)</option>
                <option value={300}>Fast (300ms)</option>
                <option value={50}>Instant</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: Security & Attack Injection Knobs (Span 5) */}
        <div className="lg:col-span-5 rounded-3xl dark:bg-[#141712] bg-[#fdfdfa] border dark:border-[#23271f] border-[#e6e4da] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b dark:border-[#23271f] border-[#e6e4da] pb-2.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold dark:text-slate-300 text-slate-700">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>ATTACK & SECURITY INJECTION</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Strict AND Conjunction</span>
          </div>

          <div className="space-y-2">
            {[
              {
                id: "none",
                label: "Normal Transaction (No Tampering)",
                tag: "PASS",
                color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30"
              },
              {
                id: "ecdsa_tamper",
                label: "Quantum Attack: Forged ECDSA (b_e corrupted)",
                tag: "REJECT AT STAGE 6",
                color: "text-rose-500 bg-rose-500/10 border-rose-500/30"
              },
              {
                id: "mldsa_tamper",
                label: "Classical Attack: Forged ML-DSA (b_pq corrupted)",
                tag: "REJECT AT STAGE 6",
                color: "text-rose-500 bg-rose-500/10 border-rose-500/30"
              },
              {
                id: "replay_nonce",
                label: "Replay Attack: Stale Nonce Re-use",
                tag: "REJECT AT STAGE 5",
                color: "text-amber-500 bg-amber-500/10 border-amber-500/30"
              },
              {
                id: "envelope_tamper",
                label: "Protocol Tamper: Invalid Envelope Version Byte",
                tag: "REJECT AT STAGE 6",
                color: "text-rose-500 bg-rose-500/10 border-rose-500/30"
              }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setTamperMode(opt.id)}
                className={`w-full text-left px-3 py-2 rounded-xl border text-xs font-mono transition-all flex items-center justify-between ${
                  tamperMode === opt.id
                    ? "dark:bg-[#1c2019] bg-slate-100 border-[#00dc82] shadow-xs"
                    : "dark:bg-[#070a0e] bg-[#f6f5ef] dark:border-[#23271f] border-[#e6e4da] opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      tamperMode === opt.id ? "bg-[#00dc82]" : "bg-slate-400"
                    }`}
                  />
                  <span className="dark:text-slate-200 text-slate-800 text-[11px] truncate max-w-[240px]">
                    {opt.label}
                  </span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${opt.color}`}>
                  {opt.tag}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Action Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl dark:bg-[#0e131d] bg-slate-100 border dark:border-[#1a2332] border-slate-300">
        <div className="flex items-center gap-3">
          <button
            onClick={handleStartSimulation}
            disabled={isRunning}
            className="py-3 px-6 rounded-xl bg-[#00dc82] hover:bg-[#00c574] disabled:opacity-50 text-slate-950 font-extrabold text-sm flex items-center gap-2.5 transition-all shadow-lg shadow-[#00dc82]/20 hover:scale-[1.01]"
          >
            <Play className={`w-4 h-4 fill-current ${isRunning ? "animate-spin" : ""}`} />
            <span>{isRunning ? "Simulating Pipeline..." : "Execute Full Lifecycle Simulation"}</span>
          </button>

          <button
            onClick={handleReset}
            disabled={isRunning}
            className="py-3 px-4 rounded-xl dark:bg-[#1c2019] bg-[#fdfdfa] border dark:border-[#30352b] border-slate-300 dark:text-slate-300 text-slate-700 hover:dark:text-white hover:text-slate-950 text-xs font-mono transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div>
            Execution Time:{" "}
            <span className="font-bold text-[#00dc82]">
              {simulationResult ? `${simulationResult.total_duration_ms} ms` : "--"}
            </span>
          </div>
          <div>
            Envelope Size: <span className="font-bold dark:text-white text-slate-900">3,380 Bytes</span>
          </div>
          <div>
            EVM Gas: <span className="font-bold text-pink-400">70,442 Gas</span>
          </div>
        </div>
      </div>

      {/* 4. Eight-Stage Interactive Stepper Navigation */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
          <span>STAGES 01 TO 08 (CLICK TO INSPECT DETAIL)</span>
          <span>CURRENT ACTIVE: STAGE 0{selectedStageTab}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {STAGE_METADATA.map((st) => {
            const Icon = st.icon;
            const isCurrentActive = currentStep === st.num;
            const isSelected = selectedStageTab === st.num;
            const stageOutput = simulationResult?.stages.find((s) => s.stage_num === st.num);
            const isSuccess = stageOutput?.status === "COMPLETED";
            const isFailed =
              stageOutput?.status === "REJECTED" || stageOutput?.status === "FAILED_VERIFICATION";

            return (
              <button
                key={st.num}
                onClick={() => setSelectedStageTab(st.num)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-28 relative overflow-hidden ${
                  isSelected
                    ? "dark:bg-[#141c28] bg-[#fdfdfa] border-[#00dc82] shadow-md ring-1 ring-[#00dc82]/30"
                    : isCurrentActive
                    ? "dark:bg-[#0f1722] bg-[#f6f5ef] border-cyan-500 shadow-sm"
                    : "dark:bg-[#141712] bg-[#fdfdfa]/70 dark:border-[#23271f] border-[#e6e4da] hover:border-slate-400"
                }`}
              >
                {/* Top Row: Icon & Status Indicator */}
                <div className="flex items-center justify-between">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${st.color}20`, color: st.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    {isFailed && <XCircle className="w-4 h-4 text-rose-500" />}
                    {!stageOutput && (
                      <span className="text-[10px] font-mono text-slate-400">0{st.num}</span>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Title & Subtitle */}
                <div>
                  <div className="text-xs font-bold dark:text-white text-slate-900 truncate">
                    {st.title}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">{st.subtitle}</div>
                </div>

                {/* Active Indicator Bar */}
                {isSelected && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ backgroundColor: st.color }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Deep-Dive Stage Inspector & Live Visualization Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Stage Deep Dive Card (Span 7) */}
        <div className="lg:col-span-7 rounded-3xl dark:bg-[#141712] bg-[#fdfdfa] border dark:border-[#23271f] border-[#e6e4da] p-6 shadow-md space-y-5">
          <div className="flex items-center justify-between border-b dark:border-[#23271f] border-[#e6e4da] pb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                style={{ backgroundColor: `${activeMeta.color}20`, color: activeMeta.color }}
              >
                <activeMeta.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold" style={{ color: activeMeta.color }}>
                    STAGE 0{activeMeta.num}
                  </span>
                  <span className="text-xs font-mono text-slate-400">• {activeMeta.subtitle}</span>
                </div>
                <h3 className="text-lg font-extrabold dark:text-white text-slate-900">
                  {activeMeta.title}
                </h3>
              </div>
            </div>

            {activeStageData && (
              <span
                className={`text-xs font-mono px-3 py-1 rounded-full font-bold border ${
                  activeStageData.status === "COMPLETED"
                    ? "dark:bg-emerald-500/10 bg-emerald-50 text-emerald-600 border-emerald-500/30"
                    : "dark:bg-rose-500/10 bg-rose-50 text-rose-500 border-rose-500/30"
                }`}
              >
                {activeStageData.status} ({activeStageData.duration_ms} ms)
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">{activeMeta.desc}</p>

          {/* Dynamic Content based on selected Stage */}
          {selectedStageTab === 1 && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl dark:bg-[#1c2019] bg-[#f6f5ef] border dark:border-[#30352b] border-[#e6e4da] space-y-2">
                <div className="text-slate-400 text-[11px] font-bold">CANONICAL TRANSACTION STRUCTURE</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500">Sender:</span>{" "}
                    <span className="dark:text-slate-300 text-slate-800 font-bold">
                      {sender.substring(0, 10)}...{sender.substring(34)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Receiver:</span>{" "}
                    <span className="dark:text-slate-300 text-slate-800 font-bold">
                      {receiver.substring(0, 10)}...{receiver.substring(34)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Amount:</span>{" "}
                    <span className="text-[#00dc82] font-bold">{amount} ETH</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Nonce:</span>{" "}
                    <span className="text-cyan-400 font-bold">
                      {activeStageData?.nonce !== undefined ? activeStageData.nonce : 0}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 italic">
                Formulation: m = (sender, receiver, amount, nonce, chain_id = 31337).
              </div>
            </div>
          )}

          {selectedStageTab === 2 && (
            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl dark:bg-[#1c2019] bg-[#f6f5ef] border dark:border-[#30352b] border-[#e6e4da]">
                  <div className="text-slate-400 text-[11px] font-bold">CLASSICAL KEYPAIR (ECDSA)</div>
                  <div className="text-sm font-extrabold text-[#00dc82] mt-1">65 Bytes</div>
                  <div className="text-[11px] text-slate-500 mt-1">Curve: secp256k1 (256-bit)</div>
                </div>
                <div className="p-3.5 rounded-2xl dark:bg-[#1c2019] bg-[#f6f5ef] border dark:border-[#30352b] border-[#e6e4da]">
                  <div className="text-slate-400 text-[11px] font-bold">POST-QUANTUM KEYPAIR (ML-DSA)</div>
                  <div className="text-sm font-extrabold text-purple-400 mt-1">1,952 Bytes</div>
                  <div className="text-[11px] text-slate-500 mt-1">NIST FIPS 204 Parameter Set 2</div>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl dark:bg-[#1c2019] bg-[#f6f5ef] border dark:border-[#30352b] border-[#e6e4da]">
                <div className="text-slate-400 text-[11px] font-bold">COMBINED PUBLIC KEY BINDING</div>
                <div className="text-xs dark:text-slate-300 text-slate-800 mt-1 font-bold">
                  |α_pk| = 65 B + 1,952 B = 2,017 Bytes
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Address Derivation: A = Truncate_160(SHA-256(pk_e || pk_pq))
                </div>
              </div>
            </div>
          )}

          {selectedStageTab === 3 && (
            <div className="space-y-3 font-mono text-xs">
              <div className="text-slate-400 text-[11px] font-bold">
                CANONICAL 3,380-BYTE ENVELOPE STRIP (TABLE 4)
              </div>
              <div className="flex h-12 rounded-xl overflow-hidden border dark:border-[#30352b] border-slate-300 shadow-inner">
                <div
                  className="w-[3%] bg-cyan-600 flex items-center justify-center text-[10px] text-white font-bold"
                  title="Version: 1 Byte (0x01)"
                >
                  v
                </div>
                <div
                  className="w-[10%] bg-emerald-600 flex items-center justify-center text-[10px] text-white font-bold truncate px-1"
                  title="ECDSA DER: ~70 Bytes"
                >
                  ECDSA (70B)
                </div>
                <div
                  className="w-[87%] bg-purple-600 flex items-center justify-center text-[10px] text-white font-bold truncate px-2"
                  title="ML-DSA-65 Signature: 3,309 Bytes"
                >
                  σ_pq ML-DSA-65 Lattice Signature (3,309 Bytes)
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Version: 1 B</span>
                <span>ECDSA: ~70 B</span>
                <span>ML-DSA: 3,309 B</span>
                <span className="text-[#00dc82] font-bold">Total: Exactly 3,380 Bytes</span>
              </div>
              <div className="p-3 rounded-xl dark:bg-[#1c2019] bg-[#f6f5ef] text-[11px] text-slate-400">
                Digest Context: SHA3-512(&apos;HYB-SIG&apos; || Enc(v, α_pk, m))
              </div>
            </div>
          )}

          {selectedStageTab === 4 && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl dark:bg-[#1c2019] bg-[#f6f5ef] border dark:border-[#30352b] border-[#e6e4da] space-y-2">
                <div className="text-slate-400 text-[11px] font-bold">P2P MESH PROPAGATION ROUTE</div>
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                  <span>Node #{activeStageData?.sender_node || 4}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span>Node #18</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span>Node #42</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span>Node #{activeStageData?.receiver_node || 87}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                  <div>Hops: {activeStageData?.hops || 3} intermediate nodes</div>
                  <div>Latency: {activeStageData?.network_latency_ms || 1.18} ms</div>
                  <div>Payload Transfer: 3,380 Bytes</div>
                  <div>Mesh Bandwidth: {activeStageData?.bandwidth_kb || 9.9} KB</div>
                </div>
              </div>
            </div>
          )}

          {selectedStageTab === 5 && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl dark:bg-[#1c2019] bg-[#f6f5ef] border dark:border-[#30352b] border-[#e6e4da] space-y-2">
                <div className="text-slate-400 text-[11px] font-bold">MEMPOOL INGESTION GATES</div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Anti-Replay Nonce Verification:</span>
                  <span
                    className={
                      tamperMode === "replay_nonce"
                        ? "text-rose-500 font-bold"
                        : "text-emerald-500 font-bold"
                    }
                  >
                    {tamperMode === "replay_nonce" ? "FAILED (STALE NONCE)" : "PASSED (NONCE 0)"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Duplicate Hash Filter:</span>
                  <span className="text-emerald-500 font-bold">PASSED (UNIQUE TX_ID)</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Mempool Queue Status:</span>
                  <span className="text-cyan-400 font-bold">QUEUED FOR MINING</span>
                </div>
              </div>
              {tamperMode === "replay_nonce" && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>
                    Transaction rejected by Mempool anti-replay filter. The submitted nonce was already
                    consumed by a previous block.
                  </span>
                </div>
              )}
            </div>
          )}

          {selectedStageTab === 6 && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl dark:bg-[#1c2019] bg-[#f6f5ef] border dark:border-[#30352b] border-[#e6e4da] space-y-2.5">
                <div className="text-slate-400 text-[11px] font-bold">
                  STRICT CONJUNCTION DUAL LOGIC GATE (ALGORITHM 3)
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl dark:bg-[#070a0e] bg-[#fdfdfa] border dark:border-[#1a2332] border-[#e6e4da]">
                  <span className="text-[11px]">Gate 1: ECDSA Classical (b_e):</span>
                  <span
                    className={`font-bold ${
                      tamperMode === "ecdsa_tamper" || tamperMode === "envelope_tamper"
                        ? "text-rose-500"
                        : "text-emerald-500"
                    }`}
                  >
                    {tamperMode === "ecdsa_tamper" || tamperMode === "envelope_tamper"
                      ? "FAIL (0)"
                      : "PASS (1)"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl dark:bg-[#070a0e] bg-[#fdfdfa] border dark:border-[#1a2332] border-[#e6e4da]">
                  <span className="text-[11px]">Gate 2: ML-DSA-65 Post-Quantum (b_pq):</span>
                  <span
                    className={`font-bold ${
                      tamperMode === "mldsa_tamper" || tamperMode === "envelope_tamper"
                        ? "text-rose-500"
                        : "text-emerald-500"
                    }`}
                  >
                    {tamperMode === "mldsa_tamper" || tamperMode === "envelope_tamper"
                      ? "FAIL (0)"
                      : "PASS (1)"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#00dc82]/10 border border-[#00dc82]/30">
                  <span className="font-bold text-[#00dc82]">Final Conjunction (b_e ∧ b_pq):</span>
                  <span
                    className={`font-bold text-sm ${
                      activeStageData?.strict_and_valid ? "text-[#00dc82]" : "text-rose-500"
                    }`}
                  >
                    {activeStageData?.strict_and_valid ? "ACCEPT (1)" : "REJECT (0)"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {selectedStageTab === 7 && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl dark:bg-[#1c2019] bg-[#f6f5ef] border dark:border-[#30352b] border-[#e6e4da] space-y-2">
                <div className="text-slate-400 text-[11px] font-bold">MINED BLOCK DETAILS</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500">Block Height:</span>{" "}
                    <span className="text-indigo-400 font-bold">
                      #{activeStageData?.block_height || 14}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Consensus Nonce:</span>{" "}
                    <span className="dark:text-slate-300 text-slate-800 font-bold">
                      {activeStageData?.consensus_nonce || 49182}
                    </span>
                  </div>
                </div>
                <div className="pt-1">
                  <div className="text-slate-500 text-[10px]">SHA3-512 MERKLE ROOT:</div>
                  <div className="text-[#00dc82] text-[10px] break-all font-bold">
                    {activeStageData?.merkle_root ||
                      "0xd8e7c6b5a4938271019283746501928374650192837465b4d21e"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedStageTab === 8 && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl dark:bg-[#1c2019] bg-[#f6f5ef] border dark:border-[#30352b] border-[#e6e4da] space-y-2">
                <div className="text-slate-400 text-[11px] font-bold">ANVIL EVM EXECUTION RECEIPT</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500">Contract:</span>{" "}
                    <span className="dark:text-slate-300 text-slate-800 font-bold">HybridAuth.sol</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Status:</span>{" "}
                    <span className="text-emerald-500 font-bold">0x1 (SUCCESS)</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Gas Consumed:</span>{" "}
                    <span className="text-pink-400 font-bold">70,442 Gas</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Deployment Base:</span>{" "}
                    <span className="text-slate-400">240,028 Gas</span>
                  </div>
                </div>
                <div className="pt-1 border-t dark:border-[#1a2332] border-[#e6e4da]">
                  <span className="text-slate-500 text-[11px]">State Transition:</span>{" "}
                  <span className="text-[#00dc82] font-bold">
                    Nonce 0 → 1 | Account Balance Transferred
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Terminal Log Feed (Span 5) */}
        <div className="lg:col-span-5 rounded-3xl dark:bg-[#12140f] bg-slate-900 border dark:border-[#23271f] border-slate-800 p-5 shadow-md flex flex-col justify-between h-[420px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Terminal className="w-4 h-4 text-[#00dc82]" />
              <span className="font-bold">EXECUTION CONSOLE TELEMETRY</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">STREAM ACTIVE</span>
          </div>

          <div
            ref={terminalRef}
            className="flex-1 overflow-y-auto py-3 font-mono text-[11px] space-y-1.5 text-slate-300 select-text"
          >
            {logs.length === 0 ? (
              <div className="text-slate-600 italic">
                Press &quot;Execute Full Lifecycle Simulation&quot; to begin stream...
              </div>
            ) : (
              logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`${
                    log.includes("❌") || log.includes("⛔")
                      ? "text-rose-400 font-bold"
                      : log.includes("✅")
                      ? "text-[#00dc82] font-bold"
                      : log.includes(">>")
                      ? "text-cyan-300 font-bold"
                      : "text-slate-300"
                  }`}
                >
                  {log}
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>DIU CSE Research Simulator</span>
            <span>Md. Tanvir Hasan</span>
          </div>
        </div>
      </div>
    </div>
  );
};

