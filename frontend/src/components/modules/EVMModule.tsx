"use client";

import React, { useState, useEffect } from "react";
import {
  Cpu,
  Layers,
  Fuel,
  CheckCircle2,
  XCircle,
  FileCode,
  AlertTriangle,
  Play,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { PAPER_REFERENCE_DATA, apiFetch } from "@/lib/api";

interface EVMModuleProps {
  isLiveMode: boolean;
}

export const EVMModule: React.FC<EVMModuleProps> = ({ isLiveMode }) => {
  const { evmScenarios, keyMetrics } = PAPER_REFERENCE_DATA;
  const [selectedScenario, setSelectedScenario] = useState<any>(evmScenarios[0]);
  const [evmStatus, setEvmStatus] = useState<any>({
    is_connected: true,
    endpoint: "http://127.0.0.1:8545",
    chain_id: 31337,
    contract_address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    deployment_gas: keyMetrics.deploymentGas,
    accepted_tx_gas: keyMetrics.acceptedTxGas,
    bytecode_size_bytes: 892
  });

  const [activeTab, setActiveTab] = useState<"scenarios" | "code">("scenarios");

  useEffect(() => {
    apiFetch<any>("/evm/status", {}, null).then((res) => {
      if (res) setEvmStatus(res);
    });
  }, []);

  const contractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * HybridAuth
 * Ethereum-compatible stateful transaction layer for the
 * proposed ECDSA + ML-DSA-65 hybrid authentication framework.
 *
 * Evaluated in 'A Secure and Scalable Hybrid Classical-Post-Quantum Cryptographic Framework'
 * Author: Md. Tanvir Hasan (Daffodil International University)
 */
contract HybridAuth {
    mapping(address => uint256) public nonce;
    mapping(bytes32 => bool) public processedTransactions;

    event HybridTransactionAccepted(
        address indexed sender,
        address indexed receiver,
        uint256 amount,
        uint256 txNonce,
        bytes32 indexed transactionId
    );

    function submitTransaction(
        address receiver,
        uint256 amount,
        uint256 txNonce,
        bytes32 transactionId,
        bool ecdsaValid,
        bool mlDsaValid
    ) external returns (bool) {
        // Nonce validation (Replay freshness)
        require(txNonce == nonce[msg.sender], "Invalid nonce");

        // Transaction uniqueness
        require(!processedTransactions[transactionId], "Transaction already processed");

        // Hybrid strict AND verification policy
        require(ecdsaValid && mlDsaValid, "Hybrid verification failed");

        // State updates
        processedTransactions[transactionId] = true;
        nonce[msg.sender]++;

        emit HybridTransactionAccepted(msg.sender, receiver, amount, txNonce, transactionId);
        return true;
    }
}`;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-mono text-xs border border-blue-500/20 font-bold">
              Section 3.8 & Tables 13, 14
            </span>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Ethereum-Compatible EVM Integration & HybridAuth Contract
            </h3>
          </div>
          <span className="text-xs font-mono text-teal-400">
            Chain ID: {evmStatus.chain_id} (Anvil 1.8.1)
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
          Extends the Python simulation with an EVM stateful execution layer. Deploys the Solidity{" "}
          <code className="text-teal-300">HybridAuth</code> contract to a local Anvil node using Web3.py.
          Measures contract deployment gas (<strong className="text-amber-300">{evmStatus.deployment_gas.toLocaleString()} gas</strong>)
          and accepted transaction gas (<strong className="text-amber-300">{evmStatus.accepted_tx_gas.toLocaleString()} gas</strong>).
        </p>
      </div>

      {/* Gas Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 font-medium">Deployment Gas</div>
          <div className="text-xl font-bold text-amber-400 font-mono">
            {evmStatus.deployment_gas.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400">Bytecode: {evmStatus.bytecode_size_bytes} Bytes</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 font-medium">Accepted Tx Gas</div>
          <div className="text-xl font-bold text-amber-400 font-mono">
            {evmStatus.accepted_tx_gas.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400">Transaction T1 (Block 3)</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 font-medium">Contract Address</div>
          <div className="text-xs font-bold text-teal-300 font-mono truncate">
            {evmStatus.contract_address}
          </div>
          <div className="text-[10px] text-slate-400">Solidity 0.8.28</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 font-medium">Functional Scenarios</div>
          <div className="text-xl font-bold text-emerald-400 font-mono">5 / 5 PASS</div>
          <div className="text-[10px] text-slate-400">100% Matching Expectations</div>
        </div>
      </div>

      {/* Tab Controls: Scenarios vs Contract Code */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("scenarios")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "scenarios"
              ? "bg-slate-800 text-teal-300 border border-slate-700"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Functional Test Scenarios (Table 14)
        </button>
        <button
          onClick={() => setActiveTab("code")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "code"
              ? "bg-slate-800 text-teal-300 border border-slate-700"
              : "text-slate-400 hover:text-white"
          }`}
        >
          HybridAuth.sol Source Code
        </button>
      </div>

      {activeTab === "scenarios" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scenario Selector List */}
          <div className="space-y-2">
            {evmScenarios.map((s) => {
              const isSelected = selectedScenario.id === s.id;
              const isAccept = s.expected === "Accept";
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedScenario(s)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-slate-800/90 border-teal-400 shadow-md ring-1 ring-teal-400"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-teal-400">{s.id}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isAccept
                          ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                          : "bg-rose-500/10 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {s.expected.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-white line-clamp-1">{s.scenario}</div>
                </div>
              );
            })}
          </div>

          {/* Scenario Detail Panel */}
          <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-teal-400 font-bold">{selectedScenario.id}</span>
                <h4 className="text-sm font-bold text-white mt-0.5">{selectedScenario.scenario}</h4>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
                RESULT: {selectedScenario.result}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Observed Evidence</div>
                <div className="text-slate-200 font-mono">{selectedScenario.evidence}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Gas Consumed</div>
                  <div className="text-lg font-bold text-amber-400 font-mono">
                    {selectedScenario.gas > 0 ? `${selectedScenario.gas.toLocaleString()} gas` : "0 (Revert at estimation)"}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Execution Stage</div>
                  <div className="text-xs font-bold text-slate-300 font-mono">
                    {selectedScenario.expected === "Accept" ? "Mined in Local Block 3" : "Pre-submission (eth_estimateGas)"}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Section 4.7.2 Research Analysis</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  For rejection scenarios T2–T5, transactions revert during <code>eth_estimateGas</code> prior to block inclusion.
                  No mined failed-transaction receipts are generated, preventing wasted gas.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 overflow-x-auto">
          <pre className="text-xs font-mono text-slate-300 leading-relaxed">
            {contractCode}
          </pre>
        </div>
      )}

      {/* Scientific Integrity Callout */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 leading-relaxed space-y-1">
        <strong className="text-slate-300">Important Scientific Verification Boundary (Section 3.8):</strong>
        <p>
          The <code>HybridAuth</code> smart contract enforces state transitions, sender-specific application nonces, and
          caller-supplied Boolean verification results. It does not perform native on-chain ML-DSA-65 polynomial verification.
          Off-chain ML-DSA verification runs in the Python research layer.
        </p>
      </div>
    </div>
  );
};

