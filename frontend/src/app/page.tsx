"use client";

import React, { useState } from "react";
import { AgentShieldHeader, ActiveNavTab } from "@/components/navigation/AgentShieldHeader";
import { ScenarioBar, SCENARIOS, ScenarioItem } from "@/components/navigation/ScenarioBar";
import { ArchitectureCanvas, SimulationState } from "@/components/architecture/ArchitectureCanvas";
import { AuditLogFooter } from "@/components/architecture/AuditLogFooter";
import { NodeInspectorDrawer } from "@/components/architecture/NodeInspectorDrawer";
import { ARCHITECTURE_NODES } from "@/lib/architectureData";

// Deep-Dive Research Views
import { PipelineModule } from "@/components/modules/PipelineModule";
import { CryptoModule } from "@/components/modules/CryptoModule";
import { MempoolModule } from "@/components/modules/MempoolModule";
import { SecurityModule } from "@/components/modules/SecurityModule";
import { MigrationModule } from "@/components/modules/MigrationModule";
import { EVMModule } from "@/components/modules/EVMModule";
import { ExternalLink, ShieldCheck } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveNavTab>("architecture");
  const [selectedScenario, setSelectedScenario] = useState<ScenarioItem>(SCENARIOS[0]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [isLiveMode, setIsLiveMode] = useState<boolean>(true);

  // Simulation State
  const [simulationState, setSimulationState] = useState<SimulationState>({
    currentStep: 0,
    isRunning: false,
    scenarioId: "normal",
    ecdsaValid: true,
    mldsaValid: true,
    strictAndPassed: true,
    rejectionReason: undefined,
    txHash: "0x8f575a0da78a9b94f534d2bd54d6d75a8cd91c306d3f990a8746f790a42b4b1d",
    blockNumber: 14
  });

  const [auditStatus, setAuditStatus] = useState<"IDLE" | "SIMULATING" | "ACCEPT" | "REJECT">("IDLE");
  const [outcomeMessage, setOutcomeMessage] = useState<string>("");

  // Run End-to-End Simulation through the 6 architecture stages
  const handleRunSimulation = () => {
    if (simulationState.isRunning) return;

    // Switch to architecture view if on another tab to show the live journey
    if (activeTab !== "architecture" && activeTab !== "workflow") {
      setActiveTab("architecture");
    }

    setAuditStatus("SIMULATING");
    setSimulationState((prev) => ({
      ...prev,
      isRunning: true,
      currentStep: 1,
      scenarioId: selectedScenario.id
    }));

    // Step 1: Network & Transaction Generation
    setTimeout(() => {
      setSimulationState((prev) => ({ ...prev, currentStep: 2 }));
    }, 400);

    // Step 2: Hybrid KeyGen & Dual Public Key Binding
    setTimeout(() => {
      setSimulationState((prev) => ({ ...prev, currentStep: 3 }));
    }, 900);

    // Step 3: Canonical Signed Context & Assembly
    setTimeout(() => {
      setSimulationState((prev) => ({ ...prev, currentStep: 4 }));

      // Evaluate verification outcomes based on selected scenario
      const sc = selectedScenario.id;
      let eValid = true;
      let pqValid = true;
      let andPassed = true;
      let rejMsg = "";

      if (sc === "normal") {
        eValid = true;
        pqValid = true;
        andPassed = true;
      } else if (sc === "ecdsa_invalid") {
        eValid = false;
        pqValid = true;
        andPassed = false;
        rejMsg = "ECDSA scalar forged via Shor's discrete-log factorization. Rejected by lattice verification gate.";
      } else if (sc === "mldsa_invalid") {
        eValid = true;
        pqValid = false;
        andPassed = false;
        rejMsg = "Post-quantum ML-DSA-65 lattice vector corrupted. Fails NIST FIPS 204 infinity-norm bound check.";
      } else if (sc === "replay_nonce") {
        eValid = true;
        pqValid = true;
        andPassed = false;
        rejMsg = "Account sequence nonce already consumed in block #13. Rejected by Mempool Duplicate Nonce Guard.";
      } else if (sc === "payload_modified") {
        eValid = false;
        pqValid = false;
        andPassed = false;
        rejMsg = "Canonical message digest d = SHA3-512(...) diverges. Both ECDSA and ML-DSA-65 signature checks failed.";
      } else if (sc === "version_unsupported") {
        eValid = false;
        pqValid = false;
        andPassed = false;
        rejMsg = "Envelope version byte 0x99 is not in allow-list {0x01}. Rejected by Hybrid Signature Parser.";
      }

      setOutcomeMessage(rejMsg);
      setSimulationState((prev) => ({
        ...prev,
        ecdsaValid: eValid,
        mldsaValid: pqValid,
        strictAndPassed: andPassed,
        rejectionReason: rejMsg
      }));
    }, 1500);

    // Step 5: Blockchain Processing & Ledger Update (or Halt)
    setTimeout(() => {
      setSimulationState((prev) => ({ ...prev, currentStep: 5 }));
      const passed = selectedScenario.expectedOutcome === "ACCEPT";
      setAuditStatus(passed ? "ACCEPT" : "REJECT");
    }, 2100);

    // Step 6: Completion
    setTimeout(() => {
      setSimulationState((prev) => ({ ...prev, currentStep: 6, isRunning: false }));
    }, 2700);
  };

  // Reset simulation back to clean idle state
  const handleReset = () => {
    setSimulationState({
      currentStep: 0,
      isRunning: false,
      scenarioId: selectedScenario.id,
      ecdsaValid: true,
      mldsaValid: true,
      strictAndPassed: true,
      rejectionReason: undefined,
      txHash: "0x8f575a0da78a9b94f534d2bd54d6d75a8cd91c306d3f990a8746f790a42b4b1d",
      blockNumber: 14
    });
    setAuditStatus("IDLE");
    setOutcomeMessage("");
  };

  // Node selected in architecture diagram
  const activeNodeDetail = selectedNodeId ? ARCHITECTURE_NODES[selectedNodeId] || null : null;

  return (
    <div className="min-h-screen dark:bg-[#040609] bg-[#F8F8F5] text-[#202124] dark:text-slate-100 flex flex-col justify-between py-3 sm:py-6 transition-colors duration-300">
      <div className="w-full flex flex-col space-y-4">
        {/* 1. Floating AgentShield Top Header with Navigation Tabs & Lime-Green Demo CTA */}
        <AgentShieldHeader
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedNodeId(null);
          }}
          isRunning={simulationState.isRunning}
          onRunSimulation={handleRunSimulation}
          onReset={handleReset}
          onTogglePresentation={() => setIsPresentationMode(!isPresentationMode)}
          isPresentationMode={isPresentationMode}
        />

        {/* 2. Interactive Scenario Bar (Only on Architecture & Workflow tabs) */}
        {(activeTab === "architecture" || activeTab === "workflow") && (
          <ScenarioBar
            selectedScenario={selectedScenario.id}
            onSelectScenario={(sc) => {
              setSelectedScenario(sc);
              handleReset();
            }}
            isRunning={simulationState.isRunning}
          />
        )}

        {/* 3. Main Workspace Area: Consistent Fixed-Width Container */}
        <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-2">
          {/* TAB 1: ARCHITECTURE DIAGRAM (Primary Research Overview) */}
          {activeTab === "architecture" && (
            <div className="space-y-6">
              <ArchitectureCanvas
                onSelectNode={(nodeId) => setSelectedNodeId(nodeId)}
                selectedNodeId={selectedNodeId}
                simulationState={simulationState}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />

              {/* Bottom 3 Cards: What the user reads (EN · বাংলা), Audit Log, 100-Node Mesh */}
              <AuditLogFooter
                status={auditStatus}
                outcomeMessage={outcomeMessage}
                txId={simulationState.txHash}
                blockIndex={simulationState.blockNumber}
                gasUsed={70442}
              />
            </div>
          )}

          {/* TAB 2: WORKFLOW SIMULATION LAB */}
          {activeTab === "workflow" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0b0e14] border border-[#E6E8E5] dark:border-[#1e2736] flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-[#202124] dark:text-white">
                    End-to-End Hybrid Transaction Pipeline Laboratory
                  </h2>
                  <p className="text-xs font-mono text-[#777B78]">
                    Execution trace: KeyGen → Binding → SHA3-512 Signed Context → Dual Signing → Strict AND → EVM Block
                  </p>
                </div>
                <button
                  onClick={handleRunSimulation}
                  disabled={simulationState.isRunning}
                  className="px-4 py-2 rounded-xl bg-[#00dc82] hover:bg-[#00c574] text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <span>{simulationState.isRunning ? "Simulating..." : "Execute Pipeline"}</span>
                </button>
              </div>
              <PipelineModule isLiveMode={isLiveMode} />
            </div>
          )}

          {/* TAB 3: CRYPTOGRAPHY BENCHMARKS & ENVELOPE */}
          {activeTab === "cryptography" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0b0e14] border border-[#E6E8E5] dark:border-[#1e2736]">
                <h2 className="text-base font-extrabold text-[#202124] dark:text-white">
                  Cryptographic Performance & 3,380 B Wire Envelope
                </h2>
                <p className="text-xs font-mono text-[#777B78]">
                  Table 3 Benchmarks (1,000-run statistics), KeyGen/Sign/Verify latencies, and canonical byte layout
                </p>
              </div>
              <CryptoModule isLiveMode={isLiveMode} />
            </div>
          )}

          {/* TAB 4: BLOCKCHAIN & MEMPOOL */}
          {activeTab === "blockchain" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0b0e14] border border-[#E6E8E5] dark:border-[#1e2736]">
                <h2 className="text-base font-extrabold text-[#202124] dark:text-white">
                  Blockchain Transaction Pool & SHA3-512 Merkle Block Engine
                </h2>
                <p className="text-xs font-mono text-[#777B78]">
                  Mempool admission, monotonic account nonces, Merkle tree construction, and candidate block assembly
                </p>
              </div>
              <MempoolModule isLiveMode={isLiveMode} />
            </div>
          )}

          {/* TAB 5: SECURITY ABLATION & ATTACK EVALUATION */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0b0e14] border border-[#E6E8E5] dark:border-[#1e2736]">
                <h2 className="text-base font-extrabold text-[#202124] dark:text-white">
                  Security Attack Evaluation & Ablation Analysis (C0–C5)
                </h2>
                <p className="text-xs font-mono text-[#777B78]">
                  Table 11 security matrix, quantum attack vectors (Shor’s factorization), and classical-fallback mitigation
                </p>
              </div>
              <SecurityModule isLiveMode={isLiveMode} />
            </div>
          )}

          {/* TAB 6: SEVEN-PHASE MIGRATION TIMELINE */}
          {activeTab === "migration" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0b0e14] border border-[#E6E8E5] dark:border-[#1e2736]">
                <h2 className="text-base font-extrabold text-[#202124] dark:text-white">
                  Seven-Phase Network Migration & The 75.4% Security Trough
                </h2>
                <p className="text-xs font-mono text-[#777B78]">
                  Table 9 empirical adoption timeline (P1–P7), transitional parity analysis, and dual-stack hard-fork safety
                </p>
              </div>
              <MigrationModule isLiveMode={isLiveMode} />
            </div>
          )}

          {/* TAB 7: EVM INTEGRATION */}
          {activeTab === "evm" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0b0e14] border border-[#E6E8E5] dark:border-[#1e2736]">
                <h2 className="text-base font-extrabold text-[#202124] dark:text-white">
                  Ethereum EVM Integration Boundary (Solidity 0.8.28, Anvil & Web3.py)
                </h2>
                <p className="text-xs font-mono text-[#777B78]">
                  Table 12 gas consumption (70,442 gas), HybridAuth.sol demonstrator, and off-chain precompile architecture
                </p>
              </div>
              <EVMModule isLiveMode={isLiveMode} />
            </div>
          )}
        </main>
      </div>

      {/* 4. Academic Citation & Research Affiliation Footer */}
      <footer className="w-full max-w-7xl mx-auto px-3 sm:px-6 mt-12 pt-4 border-t border-[#E6E8E5] dark:border-[#161d27] flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#777B78] gap-3">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <ShieldCheck className="w-4 h-4 text-[#00dc82]" />
          <span>
            <strong className="text-[#202124] dark:text-white">Md. Tanvir Hasan</strong> · Dept. of Computer Science Engineering, Daffodil International University
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://orcid.org/0009-0008-9130-3360"
            target="_blank"
            rel="noreferrer"
            className="text-[#00dc82] hover:underline flex items-center gap-1 font-bold"
          >
            <span>ORCID: 0009-0008-9130-3360</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-[#777B78]">NIST FIPS 204 · RFC 6979</span>
        </div>
      </footer>

      {/* 5. Right-Side Contextual Node Inspector Drawer */}
      <NodeInspectorDrawer
        node={activeNodeDetail}
        onClose={() => setSelectedNodeId(null)}
      />
    </div>
  );
}
