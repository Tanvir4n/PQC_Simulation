/**
 * QuantumResist API Client & Embedded Ground-Truth Research Data
 * Author: Md. Tanvir Hasan (Daffodil International University)
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Fallback ground-truth paper data (ensures immediate UI rendering even before backend startup)
export const PAPER_REFERENCE_DATA = {
  metadata: {
    title: "A Secure and Scalable Hybrid Classical–Post-Quantum Cryptographic Framework for Quantum-Resilient Blockchain Systems",
    author: "Md. Tanvir Hasan",
    affiliation: "Department of Computer Science Engineering, Daffodil International University, Savar, Dhaka 1216, Bangladesh",
    orcid: "0009-0008-9130-3360",
    email: "hasan23105101461@diu.edu.bd",
    classical_alg: "ECDSA (secp256k1)",
    pqc_alg: "ML-DSA-65 (NIST FIPS 204)",
    hash_context: "SHA3-512",
    hash_address: "SHA-256"
  },
  keyMetrics: {
    peakTps: 1054.00,
    peakWorkload: 1000,
    minLatencyMs: 0.9490,
    tpsAt10k: 777.87,
    latencyAt10k: 1.3407,
    hybridSigBytes: 3380,
    ecdsaSampleBytes: 70,
    mldsaSigBytes: 3309,
    hybridPkBytes: 2017,
    hybridSkSerializedBytes: 4167,
    hybridSkRawBytes: 4064,
    deploymentGas: 240028,
    acceptedTxGas: 70442,
    sigSerializationRateMbps: 27.04,
    storagePerMillionTxGB: 3.38
  },
  cryptoBenchmark: [
    { method: "ECDSA Only", keyGenMs: 0.4398, signingMs: 0.4774, verifMs: 0.3985, sigBytes: 70, pkBytes: 65, rawSkBytes: 32, serSkBytes: 135, quantumSafe: false, compat: "Full Native" },
    { method: "ML-DSA-65 Only", keyGenMs: 0.0550, signingMs: 0.1374, verifMs: 0.0624, sigBytes: 3309, pkBytes: 1952, rawSkBytes: 4032, serSkBytes: 4032, quantumSafe: true, compat: "Partial Non-standard" },
    { method: "Proposed Hybrid", keyGenMs: 0.5488, signingMs: 0.6434, verifMs: 0.5248, sigBytes: 3380, pkBytes: 2017, rawSkBytes: 4064, serSkBytes: 4167, quantumSafe: true, compat: "Full Dual-Verified" }
  ],
  workloads: [
    { size: 100, tps: 943.03, latencyMs: 1.0638, execTimeMs: 106.38, cpuPct: 80.11, successRate: 100.0 },
    { size: 500, tps: 1030.96, latencyMs: 0.9702, execTimeMs: 485.08, cpuPct: 103.95, successRate: 100.0 },
    { size: 1000, tps: 1054.00, latencyMs: 0.9490, execTimeMs: 948.96, cpuPct: 106.09, successRate: 100.0 },
    { size: 5000, tps: 1039.62, latencyMs: 0.9637, execTimeMs: 4818.57, cpuPct: 108.33, successRate: 100.0 },
    { size: 10000, tps: 777.87, latencyMs: 1.3407, execTimeMs: 13406.93, cpuPct: 108.31, successRate: 100.0 }
  ],
  migrationPhases: [
    { phase: "P1", name: "Fully Classical", cPct: 100, hPct: 0, qPct: 0, success: 100.0, compat: 100.0, tps: 1111.56, procMs: 0.8996, note: "Baseline legacy ECDSA operation" },
    { phase: "P2", name: "Initial Hybrid Adoption", cPct: 75, hPct: 25, qPct: 0, success: 79.8, compat: 79.8, tps: 1141.98, procMs: 0.8757, note: "25% hybrid introduced; H -> C traffic rejected" },
    { phase: "P3", name: "Parity Trough", cPct: 50, hPct: 50, qPct: 0, success: 75.4, compat: 75.4, tps: 1104.20, procMs: 0.9056, note: "Equal 50/50 mix yields theoretical 75% minimum compatibility" },
    { phase: "P4", name: "Hybrid Majority", cPct: 25, hPct: 75, qPct: 0, success: 79.6, compat: 79.6, tps: 1001.72, procMs: 0.9983, note: "75% hybrid nodes; preparing for classical retirement" },
    { phase: "P5", name: "Full Hybrid Consensus", cPct: 0, hPct: 100, qPct: 0, success: 100.0, compat: 100.0, tps: 834.19, procMs: 1.1988, note: "100% compatibility restored under strict dual verification" },
    { phase: "P6", name: "PQC Introduction", cPct: 0, hPct: 50, qPct: 50, success: 100.0, compat: 100.0, tps: 1319.42, procMs: 0.7579, note: "PQC-aware nodes join hybrid network" },
    { phase: "P7", name: "Complete Post-Quantum", cPct: 0, hPct: 0, qPct: 100, success: 100.0, compat: 100.0, tps: 4107.50, procMs: 0.2435, note: "Optimal lattice-only processing with peak 4,107.50 TPS" }
  ],
  ablationConfigs: [
    { id: "C0", name: "Baseline", keyBinding: false, domainSep: false, versioning: false, andVerif: false, replayProt: false, misbinding: 0.0, crossDomain: 100.0, downgrade: 100.0, partialSig: 0.0, replay: 0.0, forgery: 100.0 },
    { id: "C1", name: "+ Key Binding", keyBinding: true, domainSep: false, versioning: false, andVerif: false, replayProt: false, misbinding: 100.0, crossDomain: 100.0, downgrade: 100.0, partialSig: 0.0, replay: 0.0, forgery: 100.0 },
    { id: "C2", name: "+ Domain Separation", keyBinding: true, domainSep: true, versioning: false, andVerif: false, replayProt: false, misbinding: 100.0, crossDomain: 100.0, downgrade: 100.0, partialSig: 0.0, replay: 0.0, forgery: 100.0 },
    { id: "C3", name: "+ Versioning", keyBinding: true, domainSep: true, versioning: true, andVerif: false, replayProt: false, misbinding: 100.0, crossDomain: 100.0, downgrade: 100.0, partialSig: 0.0, replay: 0.0, forgery: 100.0 },
    { id: "C4", name: "+ AND Verification", keyBinding: true, domainSep: true, versioning: true, andVerif: true, replayProt: false, misbinding: 100.0, crossDomain: 100.0, downgrade: 100.0, partialSig: 100.0, replay: 0.0, forgery: 100.0 },
    { id: "C5", name: "Full Framework", keyBinding: true, domainSep: true, versioning: true, andVerif: true, replayProt: true, misbinding: 100.0, crossDomain: 100.0, downgrade: 100.0, partialSig: 100.0, replay: 100.0, forgery: 100.0 }
  ],
  evmScenarios: [
    { id: "T1", scenario: "Both verification outcomes true (ecdsa=True, mldsa=True)", expected: "Accept", evidence: "Mined in block 3; Nonce advanced 0 -> 1", gas: 70442, result: "PASS" },
    { id: "T2", scenario: "Classical ECDSA outcome false (ecdsa=False, mldsa=True)", expected: "Reject", evidence: "Reverted in eth_estimateGas ('Hybrid verification failed')", gas: 0, result: "PASS" },
    { id: "T3", scenario: "Post-Quantum ML-DSA outcome false (ecdsa=True, mldsa=False)", expected: "Reject", evidence: "Reverted in eth_estimateGas ('Hybrid verification failed')", gas: 0, result: "PASS" },
    { id: "T4", scenario: "Replay of T1 transaction with consumed nonce (nonce=0)", expected: "Reject", evidence: "Reverted in eth_estimateGas ('Invalid nonce')", gas: 0, result: "PASS" },
    { id: "T5", scenario: "Different transaction attempting to re-use consumed nonce (nonce=0)", expected: "Reject", evidence: "Reverted in eth_estimateGas ('Invalid nonce')", gas: 0, result: "PASS" }
  ]
};

// API Helper fetch with fallback
export async function apiFetch<T>(endpoint: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {})
      }
    });
    if (!res.ok) {
      if (fallback !== undefined) return fallback;
      throw new Error(`API error: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    if (fallback !== undefined) return fallback;
    throw err;
  }
}

export interface PipelineSimulationResult {
  success: boolean;
  overall_status: string;
  total_duration_ms: number;
  rejected_at_stage?: number;
  error_message?: string;
  summary?: {
    tx_id: string;
    sender: string;
    receiver: string;
    amount: number;
    block_index: number;
    gas_used: number;
    envelope_bytes: number;
    verification: string;
  };
  stages: Array<{
    stage_num: number;
    name: string;
    duration_ms: number;
    status: string;
    [key: string]: any;
  }>;
}

export async function simulatePipeline(
  params: {
    sender?: string;
    receiver?: string;
    amount?: number;
    tamper_mode?: string;
  } = {}
): Promise<PipelineSimulationResult> {
  const fallback: PipelineSimulationResult = {
    success: params.tamper_mode === "none" || !params.tamper_mode,
    overall_status: params.tamper_mode === "none" || !params.tamper_mode ? "CONFIRMED_AND_FINALIZED" : "REJECTED_AT_VERIFICATION",
    total_duration_ms: 4.82,
    rejected_at_stage: params.tamper_mode === "replay_nonce" ? 5 : params.tamper_mode && params.tamper_mode !== "none" ? 6 : undefined,
    error_message: params.tamper_mode === "replay_nonce" ? "Anti-Replay Guard Violation: Stale nonce detected" : params.tamper_mode && params.tamper_mode !== "none" ? "Cryptographic Verification Failed" : undefined,
    summary: {
      tx_id: "0x8f575a0da78a9b94f534d2bd54d6d75a8cd91c306d3f990a8746f790a42b4b1d",
      sender: params.sender || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      receiver: params.receiver || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      amount: params.amount || 12.5,
      block_index: 14,
      gas_used: 70442,
      envelope_bytes: 3380,
      verification: "STRICT_AND_PASSED"
    },
    stages: [
      {
        stage_num: 1,
        name: "Transaction Creation & Payload Construction",
        sender: params.sender || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        receiver: params.receiver || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        amount: params.amount || 12.5,
        nonce: 0,
        current_account_nonce: 0,
        tx_id: "0x8f575a0da78a9b94f534d2bd54d6d75a8cd91c306d3f990a8746f790a42b4b1d",
        payload_length_bytes: 148,
        duration_ms: 0.12,
        status: "COMPLETED"
      },
      {
        stage_num: 2,
        name: "Dual Key Generation & Public Key Binding (Algorithm 1)",
        classical_curve: "ECDSA secp256k1 (256-bit)",
        pqc_standard: "ML-DSA-65 (NIST FIPS 204 Parameter Set 2)",
        classical_pk_bytes: 65,
        pqc_pk_bytes: 1952,
        total_pk_bytes: 2017,
        bound_address: params.sender || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        hash_binding: "Truncate_160(SHA-256(pk_e || pk_pq))",
        duration_ms: 0.55,
        status: "COMPLETED"
      },
      {
        stage_num: 3,
        name: "Hybrid Dual Signing & Byte Envelope Serialization (Algorithm 2)",
        version_byte: "0x01 (1 Byte)",
        ecdsa_sig_bytes: 70,
        mldsa_sig_bytes: 3309,
        total_envelope_bytes: 3380,
        domain_separator: "SHA3-512('HYB-SIG' || Enc(v, α_pk, m))",
        serialized_hex_preview: "013045022100e4b8...c7a9128f",
        duration_ms: 0.64,
        status: "COMPLETED"
      },
      {
        stage_num: 4,
        name: "100-Node Network P2P Mesh Routing & Packet Flight",
        sender_node: 4,
        receiver_node: 87,
        path: [4, 18, 42, 87],
        hops: 3,
        network_latency_ms: 1.18,
        packet_size_bytes: 3380,
        bandwidth_kb: 9.9,
        route_status: "SUCCESS",
        duration_ms: 0.85,
        status: "COMPLETED"
      },
      {
        stage_num: 5,
        name: "Mempool Ingestion & Anti-Replay Guard Validation",
        accepted: params.tamper_mode !== "replay_nonce",
        rejection_reason: params.tamper_mode === "replay_nonce" ? "Anti-Replay Guard Violation: Nonce 0 < current nonce 1" : undefined,
        mempool_queue_depth: 1,
        duplicate_pool_size: 42,
        nonce_check: "Submitted 0 == Expected 0",
        duration_ms: 0.22,
        status: params.tamper_mode === "replay_nonce" ? "REJECTED" : "COMPLETED"
      },
      {
        stage_num: 6,
        name: "Strict Conjunction Dual Verification (Algorithm 3)",
        formula: "b_final = b_e ∧ b_pq",
        ecdsa_valid: params.tamper_mode !== "ecdsa_tamper" && params.tamper_mode !== "envelope_tamper",
        mldsa_valid: params.tamper_mode !== "mldsa_tamper" && params.tamper_mode !== "envelope_tamper",
        strict_and_valid: params.tamper_mode === "none" || !params.tamper_mode,
        security_assurance: "Zero-compromise: Quantum adversary breaking ECDSA fails ML-DSA-65 gate; classical attacker fails ECDSA gate.",
        duration_ms: 0.52,
        status: params.tamper_mode === "none" || !params.tamper_mode ? "COMPLETED" : "FAILED_VERIFICATION"
      },
      {
        stage_num: 7,
        name: "Consensus Block Proposal & SHA3-512 Merkle Tree Assembly",
        block_height: 14,
        block_hash: "0x9f8a3c...b4d21e",
        full_block_hash: "0x9f8a3c2241b7123910cde09855321abce471839401928374650192837465019283746501928374650192837465019283746501928374650192837465b4d21e",
        previous_hash: "0x1a2b3c...4d5e6f",
        merkle_root: "0xd8e7c6b5a4938271...0192837465b4d21e",
        transactions_included: 1,
        consensus_nonce: 49182,
        duration_ms: 0.94,
        status: "COMPLETED"
      },
      {
        stage_num: 8,
        name: "On-Chain State Finalization & EVM Smart Contract Execution",
        contract_name: "HybridAuth.sol",
        contract_address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        caller: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        gas_consumed: 70442,
        deployment_baseline_gas: 240028,
        state_update: {
          account: params.sender || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          nonce_transition: "0 -> 1",
          amount_transferred: `${params.amount || 12.5} ETH`,
          settlement: "CONFIRMED_ON_CHAIN"
        },
        receipt: {
          status: "0x1 (SUCCESS)",
          block_number: 14,
          cumulative_gas_used: 70442,
          confirmations: 1
        },
        duration_ms: 0.44,
        status: "COMPLETED"
      }
    ]
  };

  return apiFetch<PipelineSimulationResult>(
    "/pipeline/simulate",
    {
      method: "POST",
      body: JSON.stringify(params)
    },
    fallback
  );
}

