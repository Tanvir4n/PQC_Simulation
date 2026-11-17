"""
Seven-Phase Blockchain Migration Engine
Classical -> Hybrid (ECDSA + ML-DSA-65) -> Post-Quantum (PQC-Only)
Evaluated in 'A Secure and Scalable Hybrid Classical-Post-Quantum Cryptographic Framework'
Author: Md. Tanvir Hasan
"""

import random
from typing import Dict, Any, List


class MigrationEngine:
    PHASES = [
        {
            "phase": "P1",
            "name": "Fully Classical Baseline",
            "classical_nodes": 100,
            "hybrid_nodes": 0,
            "pqc_nodes": 0,
            "success_rate": 100.0,
            "compatibility": 100.0,
            "tps": 1111.56,
            "processing_time_ms": 0.8996,
            "description": "Legacy ecosystem running 100% secp256k1 ECDSA. Zero post-quantum protection."
        },
        {
            "phase": "P2",
            "name": "Initial Hybrid Adoption",
            "classical_nodes": 75,
            "hybrid_nodes": 25,
            "pqc_nodes": 0,
            "success_rate": 79.8,
            "compatibility": 79.8,
            "tps": 1141.98,
            "processing_time_ms": 0.8757,
            "description": "25% hybrid nodes introduced. Incompatibility arises when hybrid sends to classical receiver."
        },
        {
            "phase": "P3",
            "name": "Classical-Hybrid Parity Trough",
            "classical_nodes": 50,
            "hybrid_nodes": 50,
            "pqc_nodes": 0,
            "success_rate": 75.4,
            "compatibility": 75.4,
            "tps": 1104.20,
            "processing_time_ms": 0.9056,
            "description": "Equal 50/50 split maximizes incompatible cross-type traffic. Lowest compatibility in transition roadmap."
        },
        {
            "phase": "P4",
            "name": "Pre-Hardfork Majority",
            "classical_nodes": 25,
            "hybrid_nodes": 75,
            "pqc_nodes": 0,
            "success_rate": 79.6,
            "compatibility": 79.6,
            "tps": 1001.72,
            "processing_time_ms": 0.9983,
            "description": "75% hybrid dominance. Preparing for final deprecation of legacy classical-only nodes."
        },
        {
            "phase": "P5",
            "name": "Full Hybrid Consensus",
            "classical_nodes": 0,
            "hybrid_nodes": 100,
            "pqc_nodes": 0,
            "success_rate": 100.0,
            "compatibility": 100.0,
            "tps": 834.19,
            "processing_time_ms": 1.1988,
            "description": "All classical-only receivers retired. 100% compatibility restored under dual-signature strict AND."
        },
        {
            "phase": "P6",
            "name": "PQC Introduction",
            "classical_nodes": 0,
            "hybrid_nodes": 50,
            "pqc_nodes": 50,
            "success_rate": 100.0,
            "compatibility": 100.0,
            "tps": 1319.42,
            "processing_time_ms": 0.7579,
            "description": "Introducing pure ML-DSA-65 nodes alongside hybrid nodes. Both are mutually post-quantum aware."
        },
        {
            "phase": "P7",
            "name": "Complete Post-Quantum Operation",
            "classical_nodes": 0,
            "hybrid_nodes": 0,
            "pqc_nodes": 100,
            "success_rate": 100.0,
            "compatibility": 100.0,
            "tps": 4107.50,
            "processing_time_ms": 0.2435,
            "description": "Final quantum-resilient state. Lattice-only verification yields peak throughput of 4,107.50 TPS."
        }
    ]

    @classmethod
    def get_reference_phases(cls) -> List[Dict[str, Any]]:
        return cls.PHASES

    @staticmethod
    def calculate_theoretical_compatibility(p_c: float, p_h: float, p_q: float = 0.0) -> float:
        """
        Theoretical formula from Equation (13):
        P_compat = 1 - p_H * p_C (for classical-hybrid mix)
        """
        total = p_c + p_h + p_q
        if total == 0:
            return 100.0
        c = p_c / total
        h = p_h / total
        q = p_q / total

        # Incompatible pair is only Hybrid/PQC sender to Classical receiver:
        # C -> C (OK)
        # C -> H (OK)
        # H -> H (OK)
        # H -> C (FAIL: prob h * c)
        # Q -> C (FAIL: prob q * c)
        incompat_prob = (h * c) + (q * c)
        return max(0.0, round((1.0 - incompat_prob) * 100.0, 2))

    @staticmethod
    def run_live_simulation(p_c: float, p_h: float, p_q: float, num_trials: int = 1000) -> Dict[str, Any]:
        """
        Monte-Carlo simulation sampling random sender-receiver directed pairs.
        """
        total = p_c + p_h + p_q
        if total == 0:
            p_c, p_h, p_q = 50.0, 50.0, 0.0
            total = 100.0

        c_ratio = p_c / total
        h_ratio = p_h / total
        q_ratio = p_q / total

        nodes = []
        node_types = (
            ["classical"] * int(round(c_ratio * 100)) +
            ["hybrid"] * int(round(h_ratio * 100)) +
            ["pqc"] * (100 - int(round(c_ratio * 100)) - int(round(h_ratio * 100)))
        )
        if len(node_types) < 100:
            node_types += ["hybrid"] * (100 - len(node_types))

        random.seed()
        accepted_count = 0
        rejected_count = 0
        incompatible_reasons = {}

        for _ in range(num_trials):
            sender = random.choice(node_types)
            receiver = random.choice(node_types)

            if sender == "classical":
                # C -> C (Accept), C -> H (Accept), C -> Q (Accept if dual)
                accepted_count += 1
            elif sender == "hybrid":
                if receiver == "classical":
                    rejected_count += 1
                    incompatible_reasons["hybrid_to_classical"] = incompatible_reasons.get("hybrid_to_classical", 0) + 1
                else:
                    accepted_count += 1
            elif sender == "pqc":
                if receiver == "classical":
                    rejected_count += 1
                    incompatible_reasons["pqc_to_classical"] = incompatible_reasons.get("pqc_to_classical", 0) + 1
                else:
                    accepted_count += 1

        empirical_compat = round((accepted_count / num_trials) * 100.0, 2)
        theoretical_compat = MigrationEngine.calculate_theoretical_compatibility(p_c, p_h, p_q)

        # Estimate throughput based on component ratios
        # ECDSA avg ~ 1111 TPS, Hybrid ~ 834 TPS, PQC ~ 4107 TPS
        estimated_tps = round(c_ratio * 1111.56 + h_ratio * 834.19 + q_ratio * 4107.50, 2)

        return {
            "num_trials": num_trials,
            "inputs": {"classical_pct": p_c, "hybrid_pct": p_h, "pqc_pct": p_q},
            "empirical_compatibility": empirical_compat,
            "theoretical_compatibility": theoretical_compat,
            "accepted_transactions": accepted_count,
            "rejected_transactions": rejected_count,
            "estimated_tps": estimated_tps,
            "rejections_breakdown": incompatible_reasons
        }

