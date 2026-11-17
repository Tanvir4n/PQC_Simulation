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
      {/* Header Banner - Bento Styled */}
      <div className="rounded-2xl dark:bg-[#0b0e14] bg-white border dark:border-[#161d27] border-slate-200 p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b dark:border-[#161d27] border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-xs border border-blue-500/20 font-bold">
              Section 3.8 & Tables 13, 14
            </span>
            <h3 className="text-sm font-bold dark:text-white text-slate-900 tracking-wide">
              Ethereum-Compatible EVM Integration & HybridAuth Contract
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00dc82] animate-pulse" />
            <span className="text-xs font-mono font-bold dark:text-[#00dc82] text-emerald-600">
              Chain ID: {evmStatus.chain_id} (Anvil 1.8.1)
            </span>
          </div>
        </div>
        <p className="text-xs dark:text-slate-400 text-slate-600 leading-relaxed max-w-4xl">
          Extends the Python simulation with an EVM stateful execution layer. Deploys the Solidity{" "}
          <code className="text-cyan-600 dark:text-cyan-400 font-bold">HybridAuth</code> contract to a local Anvil node using Web3.py.
          Measures contract deployment gas (<strong className="text-amber-600 dark:text-amber-400 font-mono font-bold">{evmStatus.deployment_gas.toLocaleString()} gas</strong>)
          and accepted transaction gas (<strong className="text-amber-600 dark:text-amber-400 font-mono font-bold">{evmStatus.accepted_tx_gas.toLocaleString()} gas</strong>).
        </p>
      </div>

      {/* Gas Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl dark:bg-[#0b0e14] bg-white border dark:border-[#161d27] border-slate-200 space-y-1.5 shadow-md">
          <div className="text-[11px] dark:text-slate-400 text-slate-500 font-medium">Deployment Gas</div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono">
            {evmStatus.deployment_gas.toLocaleString()}
          </div>
          <div className="text-[10px] dark:text-slate-400 text-slate-500">Bytecode: {evmStatus.bytecode_size_bytes} Bytes</div>
        </div>
        <div className="p-5 rounded-2xl dark:bg-[#0b0e14] bg-white border dark:border-[#161d27] border-slate-200 space-y-1.5 shadow-md">
          <div className="text-[11px] dark:text-slate-400 text-slate-500 font-medium">Accepted Tx Gas</div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono">
            {evmStatus.accepted_tx_gas.toLocaleString()}
          </div>
          <div className="text-[10px] dark:text-slate-400 text-slate-500">Transaction T1 (Block 3)</div>
        </div>
        <div className="p-5 rounded-2xl dark:bg-[#0b0e14] bg-white border dark:border-[#161d27] border-slate-200 space-y-1.5 shadow-md">
          <div className="text-[11px] dark:text-slate-400 text-slate-500 font-medium">Contract Address</div>
          <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400 font-mono truncate">
            {evmStatus.contract_address}
          </div>
          <div className="text-[10px] dark:text-slate-400 text-slate-500">Solidity 0.8.28 (Foundry)</div>
        </div>
        <div className="p-5 rounded-2xl dark:bg-[#0b0e14] bg-white border dark:border-[#161d27] border-slate-200 space-y-1.5 shadow-md">
          <div className="text-[11px] dark:text-slate-400 text-slate-500 font-medium">Functional Scenarios</div>
          <div className="text-2xl font-bold dark:text-[#00dc82] text-emerald-600 font-mono">5 / 5 PASS</div>
          <div className="text-[10px] dark:text-slate-400 text-slate-500">100% Matching Expectations</div>
        </div>
      </div>

      {/* Tab Controls: Scenarios vs Contract Code */}
      <div className="flex items-center gap-2 border-b dark:border-[#161d27] border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab("scenarios")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
            activeTab === "scenarios"
              ? "dark:bg-[#00dc82]/15 bg-emerald-50 dark:text-[#00dc82] text-emerald-700 border border-[#00dc82]/40"
              : "dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900"
          }`}
        >
          Functional Test Scenarios (Table 14)
        </button>
        <button
          onClick={() => setActiveTab("code")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
            activeTab === "code"
              ? "dark:bg-[#00dc82]/15 bg-emerald-50 dark:text-[#00dc82] text-emerald-700 border border-[#00dc82]/40"
              : "dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900"
          }`}
        >
          HybridAuth.sol Source Code
        </button>
      </div>

      {activeTab === "scenarios" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scenario Selector List */}
          <div className="space-y-3">
            {evmScenarios.map((s) => {
              const isSelected = selectedScenario.id === s.id;
              const isAccept = s.expected === "Accept";
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedScenario(s)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all shadow-sm ${
                    isSelected
                      ? "dark:bg-[#00dc82]/10 bg-emerald-50 border-[#00dc82] ring-2 ring-[#00dc82]/30"
                      : "dark:bg-[#0b0e14] bg-white dark:border-[#161d27] border-slate-200 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold dark:text-[#00dc82] text-emerald-600">{s.id}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border font-mono ${
                        isAccept
                          ? "dark:bg-[#00dc82]/10 bg-emerald-50 dark:text-[#00dc82] text-emerald-700 border-[#00dc82]/30"
                          : "dark:bg-rose-500/10 bg-rose-50 text-rose-600 dark:text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {s.expected.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs font-semibold dark:text-white text-slate-900 line-clamp-1">{s.scenario}</div>
                </div>
              );
            })}
          </div>

          {/* Scenario Detail Panel */}
          <div className="lg:col-span-2 rounded-2xl dark:bg-[#0b0e14] bg-white border dark:border-[#161d27] border-slate-200 p-6 space-y-5 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b dark:border-[#161d27] border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold dark:text-[#00dc82] text-emerald-600">{selectedScenario.id} Scenario</span>
                <h4 className="text-sm font-bold dark:text-white text-slate-900 mt-0.5">{selectedScenario.scenario}</h4>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full dark:bg-[#00dc82]/10 bg-emerald-50 dark:text-[#00dc82] text-emerald-700 border border-[#00dc82]/30 font-bold">
                RESULT: {selectedScenario.result}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl dark:bg-[#07090d] bg-slate-50 border dark:border-[#161d27] border-slate-200 space-y-1">
                <div className="text-[10px] dark:text-slate-400 text-slate-500 uppercase font-semibold">Observed Evidence</div>
                <div className="dark:text-slate-200 text-slate-800 font-mono font-medium">{selectedScenario.evidence}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl dark:bg-[#07090d] bg-slate-50 border dark:border-[#161d27] border-slate-200 space-y-1">
                  <div className="text-[10px] dark:text-slate-400 text-slate-500 uppercase font-semibold">Gas Consumed</div>
                  <div className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono">
                    {selectedScenario.gas > 0 ? `${selectedScenario.gas.toLocaleString()} gas` : "0 (Revert at estimation)"}
                  </div>
                </div>
                <div className="p-4 rounded-xl dark:bg-[#07090d] bg-slate-50 border dark:border-[#161d27] border-slate-200 space-y-1">
                  <div className="text-[10px] dark:text-slate-400 text-slate-500 uppercase font-semibold">Execution Stage</div>
                  <div className="text-xs font-bold dark:text-slate-300 text-slate-700 font-mono pt-1">
                    {selectedScenario.expected === "Accept" ? "Mined in Local Block 3" : "Pre-submission (eth_estimateGas)"}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl dark:bg-amber-950/20 bg-amber-50/70 border dark:border-amber-500/30 border-amber-200 text-amber-800 dark:text-amber-300 space-y-1.5">
                <div className="font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Section 4.7.2 Research Analysis</span>
                </div>
                <p className="text-[11px] dark:text-slate-300 text-slate-600 leading-relaxed">
                  For rejection scenarios T2–T5, transactions revert during <code>eth_estimateGas</code> prior to block inclusion.
                  No mined failed-transaction receipts are generated, preventing wasted gas.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl dark:bg-[#05070a] bg-slate-900 border dark:border-[#161d27] border-slate-800 p-6 overflow-x-auto shadow-xl">
          <pre className="text-xs font-mono text-slate-200 leading-relaxed">
            {contractCode}
          </pre>
        </div>
      )}

      {/* Scientific Integrity Callout */}
      <div className="p-4 rounded-xl dark:bg-[#07090d] bg-slate-50 border dark:border-[#161d27] border-slate-200 text-xs dark:text-slate-400 text-slate-600 leading-relaxed space-y-1">
        <strong className="dark:text-slate-200 text-slate-800 font-bold">Important Scientific Verification Boundary (Section 3.8):</strong>
        <p>
          The <code>HybridAuth</code> smart contract enforces state transitions, sender-specific application nonces, and
          caller-supplied Boolean verification results. It does not perform native on-chain ML-DSA-65 polynomial verification.
          Off-chain ML-DSA verification runs in the Python research layer.
        </p>
      </div>
    </div>
  );
};
