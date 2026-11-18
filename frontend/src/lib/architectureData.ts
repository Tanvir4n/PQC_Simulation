/**
 * QuantumResist Architecture Metadata & Node Specifications
 * Based on paper: 'A Secure and Scalable Hybrid Classical–Post-Quantum Cryptographic Framework for Quantum-Resilient Blockchain Systems'
 * Author: Md. Tanvir Hasan (Daffodil International University)
 */

export interface ArchitectureNodeDetail {
  id: string;
  name: string;
  category: "network" | "crypto_classical" | "crypto_pqc" | "crypto_hybrid" | "verification" | "blockchain" | "evaluation" | "evm";
  standard?: string;
  role: string;
  purpose: string;
  inputs: string[];
  processing: string[];
  outputs: string[];
  algorithms: string[];
  securityRelevance: string;
  paperSection: string;
  mathematicalFormula?: string;
  status?: "active" | "standby" | "verified" | "rejected";
}

export const ARCHITECTURE_NODES: Record<string, ArchitectureNodeDetail> = {
  // Group A: Network & Transaction Generation
  "tx-generator": {
    id: "tx-generator",
    name: "Transaction Generator",
    category: "network",
    standard: "IEEE / Blockchain RFC",
    role: "Constructs canonical transaction payload m = (sender, receiver, value, nonce, chain_id)",
    purpose: "Instantiates user transfer intent with cryptographic timestamp, sequential nonce guard, and unique hash identification.",
    inputs: ["Sender Address (20B / 32B)", "Receiver Address", "Value (ETH/Token)", "Account Nonce", "Chain ID (31337)"],
    processing: [
      "Collects transaction intent parameters",
      "Assigns monotonic sequence nonce to prevent replay attacks",
      "Applies deterministic RLP/canonical byte serialization"
    ],
    outputs: ["Canonical Transaction Payload (m)", "Transaction Identifier (tx_id = SHA3-512(m))"],
    algorithms: ["SHA3-512", "Deterministic Canonical Encoding"],
    securityRelevance: "Ensures tamper-evident transaction intent and binds execution state to account nonce.",
    paperSection: "Section 3.1 & Algorithm 1",
    mathematicalFormula: "m = (A_S, A_R, v, n, id_chain)"
  },

  // Group B: Key Generation
  "ecdsa-keygen": {
    id: "ecdsa-keygen",
    name: "ECDSA Key Generation",
    category: "crypto_classical",
    standard: "RFC 6979 / SECG SEC 2",
    role: "Generates classical elliptic-curve scalar private key and public point",
    purpose: "Maintains backwards compatibility with existing Ethereum, Bitcoin, and EVM toolchains during transition.",
    inputs: ["Cryptographic Random Seed (256 bits of entropy)"],
    processing: [
      "Samples scalar sk_e from [1, n-1] over secp256k1",
      "Computes pk_e = sk_e * G (base point multiplication)",
      "Formats uncompressed 65-byte public key point (0x04 || X || Y)"
    ],
    outputs: ["sk_e (32B scalar / 135B PKCS#8 DER)", "pk_e (65B uncompressed EC point)"],
    algorithms: ["ECDSA (secp256k1)"],
    securityRelevance: "Vulnerable to Shor's algorithm (O(n^3) quantum polynomial time discrete logarithm solver). Serves as classical component of hybrid pair.",
    paperSection: "Section 3.1 & Algorithm 1",
    mathematicalFormula: "sk_e ← ℤ_q, pk_e = sk_e · G ∈ E(𝔽_p)"
  },

  "mldsa-keygen": {
    id: "mldsa-keygen",
    name: "ML-DSA-65 Key Generation",
    category: "crypto_pqc",
    standard: "NIST FIPS 204 (Parameter Set 2)",
    role: "Generates post-quantum Module-Lattice-Based Digital Signature keypair",
    purpose: "Guarantees quantum computational security grounded in the hardness of Module Learning with Errors (M-LWE) and Short Integer Solution (M-SIS) problems.",
    inputs: ["Random Seed xi (32 bytes entropy)"],
    processing: [
      "Expands matrix A ∈ R_q^(k×l) using SHAKE-128",
      "Samples secret vectors s1, s2 from small polynomial ring",
      "Computes public vector t = A·s1 + s2 and compresses via Power2Round"
    ],
    outputs: ["sk_pq (4,032 Bytes lattice secret key)", "pk_pq (1,952 Bytes lattice public key)"],
    algorithms: ["ML-DSA-65 (CRYSTALS-Dilithium)"],
    securityRelevance: "NIST Security Level 3 (equivalent to AES-192). Immune to known classical and quantum polynomial-time attacks.",
    paperSection: "Section 3.1 & FIPS 204 Specification",
    mathematicalFormula: "(sk_pq, pk_pq) ← ML-DSA-65.KeyGen(ξ)"
  },

  "dual-key-binding": {
    id: "dual-key-binding",
    name: "Dual Public-Key Binding",
    category: "crypto_hybrid",
    standard: "FIPS 180-4 (SHA-256)",
    role: "Binds classical pk_e and post-quantum pk_pq into a single unified hybrid blockchain address",
    purpose: "Eliminates key-misbinding attacks where an adversary associates their own public key with a victim's signature.",
    inputs: ["pk_e (65 Bytes)", "pk_pq (1,952 Bytes)", "Domain Separator 'HYB-ADDR:'"],
    processing: [
      "Constructs pre-image u = 'HYB-ADDR:' || Enc(pk_e) || Enc(pk_pq)",
      "Computes SHA-256 hash over combined pre-image",
      "Derives 20-byte or 32-byte account address: Addr = Truncate_160(SHA-256(u))"
    ],
    outputs: ["Unified Hybrid Address (0x...)", "Public Key Descriptor (α_pk = 2,017 Bytes)"],
    algorithms: ["SHA-256", "Key Concatenation"],
    securityRelevance: "Guarantees cross-algorithm binding; prevents split-identity and substitute key injection attacks.",
    paperSection: "Section 3.1 & Equation 2",
    mathematicalFormula: "Addr = Truncate_160(SHA-256('HYB-ADDR' || pk_e || pk_pq))"
  },

  // Group C: Canonical Signed Context
  "canonical-context": {
    id: "canonical-context",
    name: "Canonical Signed Context",
    category: "crypto_hybrid",
    standard: "NIST FIPS 202 (SHA3-512)",
    role: "Derives unified cryptographic message digest binding all protocol metadata",
    purpose: "Prevents cross-domain replay, downgrade, and partial-signature substitution by authenticating version, algorithm identifiers, and public keys inside the digest.",
    inputs: [
      "Version Byte v = 0x01",
      "Classical Alg ID: 'ECDSA_SECP256K1'",
      "Post-Quantum Alg ID: 'ML_DSA_65'",
      "Public Key Descriptor α_pk (2,017B)",
      "Transaction Message m"
    ],
    processing: [
      "Encodes domain header 'HYB-SIG:' || struct.pack('!B', v) || AlgIDs",
      "Concatenates with serialized transaction payload m",
      "Computes SHA3-512 sponge digest: d = SHA3-512(Context)"
    ],
    outputs: ["64-Byte Canonical Digest (d)"],
    algorithms: ["SHA3-512"],
    securityRelevance: "Ensures both classical and PQC signers authenticate identical cryptographic material under strict domain separation.",
    paperSection: "Section 3.2 & Equation 3",
    mathematicalFormula: "d = SHA3-512('HYB-SIG' || Enc(v, α_e, α_pq, m))"
  },

  // Group D: Hybrid Signing
  "ecdsa-sign": {
    id: "ecdsa-sign",
    name: "ECDSA Signing Branch",
    category: "crypto_classical",
    standard: "RFC 6979 / ANSI X9.62",
    role: "Computes classical ECDSA signature over canonical digest d",
    purpose: "Provides legacy authentication verifiable by classical clients.",
    inputs: ["Classical Private Key sk_e", "Canonical Digest d (64B)"],
    processing: [
      "Derives deterministic ephemeral nonce k from RFC 6979",
      "Calculates curve point (x1, y1) = k * G",
      "Computes r = x1 mod n, s = k^-1 * (d + r * sk_e) mod n",
      "Encodes in standard ASN.1 DER sequence: 0x30 || len || 0x02 || r_len || r || 0x02 || s_len || s"
    ],
    outputs: ["σ_e (ASN.1 DER Sequence, ~70-72 Bytes)"],
    algorithms: ["ECDSA (secp256k1)", "ASN.1 DER"],
    securityRelevance: "Signer execution time: ~0.4774 ms.",
    paperSection: "Section 3.2 & Algorithm 2",
    mathematicalFormula: "σ_e ← ECDSA.Sign(sk_e, d)"
  },

  "mldsa-sign": {
    id: "mldsa-sign",
    name: "ML-DSA-65 Signing Branch",
    category: "crypto_pqc",
    standard: "NIST FIPS 204",
    role: "Computes post-quantum lattice signature over canonical digest d",
    purpose: "Injects quantum-resilient authentication resisting Shor and Grover algorithm attacks.",
    inputs: ["Lattice Secret Key sk_pq (4,032B)", "Canonical Digest d (64B)"],
    processing: [
      "Samples masking vector y from uniform distribution in [-gamma1, gamma1]",
      "Computes high bits w1 = HighBits(A·y)",
      "Generates challenge polynomial c = H(mu || w1)",
      "Computes signature vector z = y + c·s1 with rejection sampling on ||z||_inf < gamma1 - beta"
    ],
    outputs: ["σ_pq (Fixed length: exactly 3,309 Bytes)"],
    algorithms: ["ML-DSA-65 (Rejection Sampling / Fiat-Shamir with Aborts)"],
    securityRelevance: "Signer execution time: ~0.1374 ms. Fast signing due to NTT polynomial multiplication.",
    paperSection: "Section 3.2 & Algorithm 2",
    mathematicalFormula: "σ_pq ← ML-DSA-65.Sign(sk_pq, d)"
  },

  "hybrid-assembly": {
    id: "hybrid-assembly",
    name: "Hybrid Signature Assembly",
    category: "crypto_hybrid",
    standard: "RFC 3279 DER + NIST FIPS 204",
    role: "Packages version byte, variable DER ECDSA signature, and fixed ML-DSA-65 signature into canonical byte envelope",
    purpose: "Creates uniform self-describing wire format with zero serialization ambiguity.",
    inputs: ["Version Byte v (1B)", "σ_e (DER, ~70B)", "σ_pq (3,309B)"],
    processing: [
      "Sets leading envelope version byte (0x01)",
      "Appends variable ASN.1 DER sequence length byte and payload",
      "Appends 3,309 bytes of fixed-length ML-DSA-65 lattice signature",
      "Calculates total envelope size: |o| = 1 + |DER(r,s)| + 3309 = 3,380 Bytes"
    ],
    outputs: ["Canonical Byte Envelope Σ_hyb (Observed: 3,380 Bytes)"],
    algorithms: ["Byte Serialization", "Envelope Encoding"],
    securityRelevance: "Self-delimiting envelope prevents length extension and trailing-byte malleability attacks.",
    paperSection: "Section 3.2 & Table 4",
    mathematicalFormula: "Σ = v || DER(r, s) || σ_pq"
  },

  // Group E: Verification & Strict AND
  "hybrid-parser": {
    id: "hybrid-parser",
    name: "Hybrid Signature Parser",
    category: "verification",
    standard: "Protocol Canonical Specification",
    role: "Parses and validates syntax of incoming 3,380B envelope",
    purpose: "Rejects malformed, truncated, or version-mismatched envelopes before invoking expensive cryptographic checks.",
    inputs: ["Raw Signature Bytes Σ_hyb"],
    processing: [
      "Validates envelope length >= 1 + 60 + 3309 bytes",
      "Checks version allow-list: v == 0x01",
      "Inspects ASN.1 DER header (0x30) and extracts DER length byte",
      "Delimits σ_e and σ_pq boundaries without trailing bytes"
    ],
    outputs: ["Validated Version", "Extracted σ_e", "Extracted σ_pq"],
    algorithms: ["ASN.1 DER Parser", "Bounds Checker"],
    securityRelevance: "Defends against malformed envelope and trailing-byte exploitation.",
    paperSection: "Section 3.2 & Algorithm 3"
  },

  "ecdsa-verify": {
    id: "ecdsa-verify",
    name: "ECDSA Verification",
    category: "verification",
    standard: "SECG SEC 1",
    role: "Verifies classical signature validity: b_e ∈ {0, 1}",
    purpose: "Authenticates sender under classical elliptic-curve security assumptions.",
    inputs: ["pk_e", "Canonical Digest d", "σ_e"],
    processing: [
      "Reconstructs r and s from DER byte sequence",
      "Validates range r, s ∈ [1, n-1]",
      "Computes w = s^-1 mod n, u1 = d·w mod n, u2 = r·w mod n",
      "Checks curve point (x, y) = u1·G + u2·pk_e and verifies x mod n == r"
    ],
    outputs: ["Boolean Outcome b_e (True / False)"],
    algorithms: ["ECDSA Verification"],
    securityRelevance: "Execution time: ~0.3985 ms. Fails under Shor's algorithm.",
    paperSection: "Section 3.2 & Algorithm 3",
    mathematicalFormula: "b_e = ECDSA.Verify(pk_e, d, σ_e)"
  },

  "mldsa-verify": {
    id: "mldsa-verify",
    name: "ML-DSA-65 Verification",
    category: "verification",
    standard: "NIST FIPS 204",
    role: "Verifies post-quantum lattice signature validity: b_pq ∈ {0, 1}",
    purpose: "Authenticates sender under post-quantum module-lattice security assumptions.",
    inputs: ["pk_pq", "Canonical Digest d", "σ_pq"],
    processing: [
      "Decompresses public key t1 and reconstructs matrix A via SHAKE-128",
      "Extracts signature vector z and hint vector h from σ_pq",
      "Verifies polynomial infinity norm ||z||_inf < gamma1 - beta",
      "Reconstructs w'1 = UseHint(h, A·z - c·t1·2^d) and checks c == H(mu || w'1)"
    ],
    outputs: ["Boolean Outcome b_pq (True / False)"],
    algorithms: ["ML-DSA-65 Verification (FIPS 204)"],
    securityRelevance: "Execution time: ~0.0624 ms (6.4x faster than ECDSA verification).",
    paperSection: "Section 3.2 & Algorithm 3",
    mathematicalFormula: "b_pq = ML-DSA-65.Verify(pk_pq, d, σ_pq)"
  },

  "strict-and-gate": {
    id: "strict-and-gate",
    name: "Strict Conjunction (AND) Decision",
    category: "verification",
    standard: "Zero-Compromise Security Rule",
    role: "Evaluates b_final = b_e ∧ b_pq",
    purpose: "Guarantees that a transaction is accepted ONLY if BOTH classical and post-quantum components validate. No classical-only fallback.",
    inputs: ["b_e (ECDSA Boolean)", "b_pq (ML-DSA-65 Boolean)"],
    processing: [
      "Performs boolean conjunction: b_final = b_e AND b_pq",
      "If b_final == True: ACCEPT transaction and route to Mempool",
      "If b_final == False: REJECT transaction with diagnostic reason"
    ],
    outputs: ["b_final (Accept / Reject)"],
    algorithms: ["Boolean Conjunction"],
    securityRelevance: "Zero-compromise: Quantum adversary forging ECDSA fails ML-DSA gate. Classical attacker fails ECDSA gate.",
    paperSection: "Section 3.2 & Algorithm 3",
    mathematicalFormula: "b_final = b_e ∧ b_pq"
  },

  // Group F: Blockchain Processing
  "mempool-guard": {
    id: "mempool-guard",
    name: "Mempool & Anti-Replay Guard",
    category: "blockchain",
    standard: "Blockchain Transaction Pool Protocol",
    role: "Manages pending transaction queue, nonce ordering, and duplicate rejection",
    purpose: "Prevents double-spending and stale-nonce replay attacks prior to block inclusion.",
    inputs: ["Authenticated Hybrid Transaction", "Sender Account State Nonce"],
    processing: [
      "Checks tx_id against duplicate hash pool set",
      "Verifies submitted nonce matches expected account sequence",
      "Orders transactions by priority into candidate mempool"
    ],
    outputs: ["Queued Transaction Bundle"],
    algorithms: ["O(1) Hash Set Deduplication", "Sequential Nonce Ordering"],
    securityRelevance: "Crucial protocol state management defending against replay attacks.",
    paperSection: "Section 3.3"
  },

  "merkle-block": {
    id: "merkle-block",
    name: "Block Assembly & Merkle Root",
    category: "blockchain",
    standard: "SHA3-512 Merkle Tree",
    role: "Aggregates batch of hybrid transactions into candidate block and computes hierarchical SHA3-512 Merkle root",
    purpose: "Creates cryptographic commitment over all included transactions and seals block header.",
    inputs: ["Transaction Hashes [tx_0, tx_1, ...]", "Previous Block Hash", "Block Height", "Consensus Nonce"],
    processing: [
      "Computes leaf hashes using SHA3-512",
      "Constructs binary Merkle tree iteratively to root",
      "Assembles block header: (index, prev_hash, merkle_root, timestamp, nonce)"
    ],
    outputs: ["Sealed Block Header", "SHA3-512 Merkle Root", "Committed Ledger State"],
    algorithms: ["SHA3-512 Merkle Tree"],
    securityRelevance: "Ensures ledger immutability and verifiable transaction inclusion proofs.",
    paperSection: "Section 3.3"
  },

  // Group G: EVM Integration
  "evm-bridge": {
    id: "evm-bridge",
    name: "Measured EVM Demonstrator",
    category: "evm",
    standard: "Solidity 0.8.28 / Foundry Anvil",
    role: "Executes HybridAuth.sol smart contract on local Anvil EVM instance",
    purpose: "Demonstrates practical Ethereum Virtual Machine compatibility with measured gas metrics.",
    inputs: ["Web3.py Client Call", "Sender Nonce", "Caller-Supplied Boolean Outcomes (b_e, b_pq)"],
    processing: [
      "Evaluates contract policy: Accept = nonce_valid AND !processed AND b_e AND b_pq",
      "Increments sender account nonce in contract storage",
      "Emits TransactionExecuted event and logs gas consumed: exactly 70,442 Gas"
    ],
    outputs: ["On-Chain Confirmation Receipt (0x1 SUCCESS)", "Gas Consumed (70,442 Gas)"],
    algorithms: ["EVM State Machine", "Solidity HybridAuth.sol"],
    securityRelevance: "CRITICAL DISTINCTION: Evaluates caller-supplied booleans. Off-chain ML-DSA verification runs in Python layer; not an on-chain lattice precompile.",
    paperSection: "Section 3.4 & Table 12",
    mathematicalFormula: "Gas_accept = 70,442, Gas_deploy = 240,028"
  }
};

