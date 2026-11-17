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

