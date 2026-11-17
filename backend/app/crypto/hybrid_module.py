"""
Proposed Hybrid Classical-Post-Quantum Digital Signature Framework
Combines ECDSA (secp256k1) with ML-DSA-65 (NIST FIPS 204).
Implements strict AND verification, canonical domain separation, and address binding.

Paper: 'A Secure and Scalable Hybrid Classical-Post-Quantum Cryptographic Framework'
Author: Md. Tanvir Hasan
"""

import hashlib
import time
import struct
from typing import Dict, Any, Tuple
from app.crypto.ecdsa_module import ECDSAModule
from app.crypto.dilithium_module import DilithiumModule


class HybridModule:
    VERSION = 1
    ALGORITHM_PAIR = ("ECDSA_SECP256K1", "ML_DSA_65")
    DOMAIN_TAG_ADDR = b"HYB-ADDR:"
    DOMAIN_TAG_SIG = b"HYB-SIG:"

    def __init__(self):
        self.ecdsa = ECDSAModule()
        self.dilithium = DilithiumModule()
        self.blockchain_address = None
        self.generate_keys()

    def generate_keys(self) -> Dict[str, Any]:
        """
        Algorithm 1: HybridKeyGen
        1: (ske, pke) <- ECDSA.KeyGen()
        2: (skpq, pkpq) <- MLDSA65.KeyGen()
        3: u <- HYB-ADDR || Enc(pke) || Enc(pkpq)
        4: addr <- SHA256(u)
        """
        start = time.perf_counter_ns()
        _, _, ecdsa_ms = self.ecdsa.generate_keys()
        _, _, pq_ms = self.dilithium.generate_keys()

        pke_bytes = self.ecdsa.public_key_bytes()
        pkpq_bytes = self.dilithium.public_key

        u = self.DOMAIN_TAG_ADDR + pke_bytes + pkpq_bytes
        self.blockchain_address = "0x" + hashlib.sha256(u).hexdigest()
        total_ms = (time.perf_counter_ns() - start) / 1_000_000.0

        return {
            "address": self.blockchain_address,
            "total_time_ms": total_ms,
            "ecdsa_time_ms": ecdsa_ms,
            "pqc_time_ms": pq_ms,
            "sizes": {
                "ecdsa_pk_bytes": len(pke_bytes),
                "pqc_pk_bytes": len(pkpq_bytes),
                "combined_pk_bytes": len(pke_bytes) + len(pkpq_bytes),
                "ecdsa_raw_sk_bytes": 32,
                "ecdsa_serialized_sk_bytes": self.ecdsa.private_key_size(),
                "pqc_sk_bytes": self.dilithium.private_key_size(),
                "combined_raw_sk_bytes": 32 + self.dilithium.private_key_size(),
                "combined_serialized_sk_bytes": self.ecdsa.private_key_size() + self.dilithium.private_key_size()
            }
        }

    def canonical_signed_context(self, message: bytes, version: int = 1) -> bytes:
        """
        Computes domain-separated canonical signed digest:
        d = SHA3-512(HYB-SIG || Enc(v, αe, αpq, m))
        """
        header = struct.pack("!B", version) + b":ECDSA_SECP256K1:ML_DSA_65:"
        context = self.DOMAIN_TAG_SIG + header + message
        return hashlib.sha3_512(context).digest()

    def sign(self, message: bytes) -> Dict[str, Any]:
        """
        Algorithm 2: HybridSign
        d = SHA3-512(HYB-SIG || Enc(v, αe, αpq, m))
        sige = ECDSA.Sign(ske, d)
        sigpq = MLDSA65.Sign(skpq, d)
        sigma = v || DER(r,s) || sigpq
        """
        start = time.perf_counter_ns()
        digest = self.canonical_signed_context(message, self.VERSION)

        ecdsa_sig, ecdsa_ms = self.ecdsa.sign(digest)
        pq_sig, pq_ms = self.dilithium.sign(digest)

        # Byte serialization:
        # 1 byte version + DER ECDSA bytes + 3309 bytes ML-DSA-65
        version_byte = struct.pack("!B", self.VERSION)
        der_len = len(ecdsa_sig)
        serialized_signature = version_byte + ecdsa_sig + pq_sig
        total_size = len(serialized_signature)
        total_ms = (time.perf_counter_ns() - start) / 1_000_000.0

        return {
            "version": self.VERSION,
            "algorithms": self.ALGORITHM_PAIR,
            "digest_hex": digest.hex(),
            "ecdsa_signature_hex": ecdsa_sig.hex(),
            "pqc_signature_hex": pq_sig.hex(),
            "serialized_hex": serialized_signature.hex(),
            "serialized_bytes": serialized_signature,
            "total_size_bytes": total_size,
            "envelope_breakdown": {
                "version_byte": 1,
                "ecdsa_der_bytes": der_len,
                "mldsa_bytes": len(pq_sig),
                "total_bytes": total_size
            },
            "signing_time_ms": total_ms,
            "ecdsa_time_ms": ecdsa_ms,
            "pqc_time_ms": pq_ms
        }

    def verify(
        self,
        message: bytes,
        serialized_signature: bytes,
        custom_pke=None,
        custom_pkpq=None
    ) -> Dict[str, Any]:
        """
        Algorithm 3: HybridVerify (Strict Conjunction AND Verification)
        1: Parse sigma as 1-byte v, strict DER ECDSA sequence, and 3309 bytes ML-DSA-65
        2: Recompute canonical digest d
        3: be <- ECDSA.Verify(pke, d, sige)
        4: bpq <- MLDSA65.Verify(pkpq, d, sigpq)
        5: return be AND bpq
        """
        start = time.perf_counter_ns()
        if len(serialized_signature) < 1 + 60 + DilithiumModule.SIG_SIZE:
            return {
                "valid": False,
                "error": "Signature truncated or malformed",
                "ecdsa_valid": False,
                "pqc_valid": False,
                "total_time_ms": (time.perf_counter_ns() - start) / 1_000_000.0
            }

        version = serialized_signature[0]
        if version != self.VERSION:
            return {
                "valid": False,
                "error": f"Unsupported signature version: {version}",
                "ecdsa_valid": False,
                "pqc_valid": False,
                "total_time_ms": (time.perf_counter_ns() - start) / 1_000_000.0
            }

        # Delimit ECDSA DER:
        # Standard ASN.1 DER sequence header 0x30 followed by length byte
        if serialized_signature[1] != 0x30:
            return {
                "valid": False,
                "error": "Invalid ASN.1 DER sequence identifier for ECDSA",
                "ecdsa_valid": False,
                "pqc_valid": False,
                "total_time_ms": (time.perf_counter_ns() - start) / 1_000_000.0
            }

        der_len = serialized_signature[2] + 2  # tag + length byte + payload
        ecdsa_sig = serialized_signature[1 : 1 + der_len]
        pq_sig = serialized_signature[1 + der_len :]

        if len(pq_sig) != DilithiumModule.SIG_SIZE:
            return {
                "valid": False,
                "error": f"Expected exactly {DilithiumModule.SIG_SIZE} bytes for ML-DSA-65, got {len(pq_sig)}",
                "ecdsa_valid": False,
                "pqc_valid": False,
                "total_time_ms": (time.perf_counter_ns() - start) / 1_000_000.0
            }

        digest = self.canonical_signed_context(message, version)

        # Verify Classical
        ecdsa_valid, ecdsa_ms = self.ecdsa.verify(
            digest, ecdsa_sig, public_key=custom_pke
        )

        # Verify Post-Quantum
        pqc_valid, pqc_ms = self.dilithium.verify(
            digest, pq_sig, public_key=custom_pkpq
        )

        # Strict AND logic
        overall_valid = bool(ecdsa_valid and pqc_valid)
        total_ms = (time.perf_counter_ns() - start) / 1_000_000.0

        return {
            "valid": overall_valid,
            "ecdsa_valid": bool(ecdsa_valid),
            "pqc_valid": bool(pqc_valid),
            "verification_policy": "Strict Conjunction (AND)",
            "total_time_ms": total_ms,
            "ecdsa_time_ms": ecdsa_ms,
            "pqc_time_ms": pqc_ms,
            "digest_hex": digest.hex()
        }

