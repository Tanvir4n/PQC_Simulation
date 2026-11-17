"""
Protocol Ablation Engine & Security Evaluator
Evaluates the cumulative security mechanisms from Table 11 of the paper.
Author: Md. Tanvir Hasan
"""

from typing import List, Dict, Any


class AblationEngine:
    # Ground truth values from protocol_ablation.csv and Table 11 of paper
    ABLATION_TABLE = [
        {
            "id": "C0",
            "name": "Baseline",
            "controls": {
                "key_binding": False,
                "domain_separation": False,
                "versioning": False,
                "and_verification": False,
                "replay_protection": False
            },
            "blocked_rates": {
                "key_misbinding": 0.0,
                "cross_domain": 100.0,
                "downgrade": 100.0,
                "partial_signature": 0.0,
                "replay": 0.0,
                "forgery": 100.0
            },
            "observation": "Without key binding, AND verification, or nonce/replay state, partial signatures, replays, and key substitutions pass."
        },
        {
            "id": "C1",
            "name": "+ Key Binding",
            "controls": {
                "key_binding": True,
                "domain_separation": False,
                "versioning": False,
                "and_verification": False,
                "replay_protection": False
            },
            "blocked_rates": {
                "key_misbinding": 100.0,
                "cross_domain": 100.0,
                "downgrade": 100.0,
                "partial_signature": 0.0,
                "replay": 0.0,
                "forgery": 100.0
            },
            "observation": "Enabling SHA-256 address binding immediately blocks 100% of key-misbinding attacks (+100 pp)."
        },
        {
            "id": "C2",
            "name": "+ Domain Separation",
            "controls": {
                "key_binding": True,
                "domain_separation": True,
                "versioning": False,
                "and_verification": False,
                "replay_protection": False
            },
            "blocked_rates": {
                "key_misbinding": 100.0,
                "cross_domain": 100.0,
                "downgrade": 100.0,
                "partial_signature": 0.0,
                "replay": 0.0,
                "forgery": 100.0
            },
            "observation": "Canonical domain tags ('HYB-SIG', 'HYB-ADDR') ensure cryptographic context separation."
        },
        {
            "id": "C3",
            "name": "+ Versioning",
            "controls": {
                "key_binding": True,
                "domain_separation": True,
                "versioning": True,
                "and_verification": False,
                "replay_protection": False
            },
            "blocked_rates": {
                "key_misbinding": 100.0,
                "cross_domain": 100.0,
                "downgrade": 100.0,
                "partial_signature": 0.0,
                "replay": 0.0,
                "forgery": 100.0
            },
            "observation": "Suite descriptor binding in signed digest blocks algorithm substitution and downgrade."
        },
        {
            "id": "C4",
            "name": "+ AND Verification",
            "controls": {
                "key_binding": True,
                "domain_separation": True,
                "versioning": True,
                "and_verification": True,
                "replay_protection": False
            },
            "blocked_rates": {
                "key_misbinding": 100.0,
                "cross_domain": 100.0,
                "downgrade": 100.0,
                "partial_signature": 100.0,
                "replay": 0.0,
                "forgery": 100.0
            },
            "observation": "Enforcing strict conjunction (be AND bpq) blocks 100% of partial-signature submissions (+100 pp)."
        },
        {
            "id": "C5",
            "name": "Full Framework (+ Replay Protection)",
            "controls": {
                "key_binding": True,
                "domain_separation": True,
                "versioning": True,
                "and_verification": True,
                "replay_protection": True
            },
            "blocked_rates": {
                "key_misbinding": 100.0,
                "cross_domain": 100.0,
                "downgrade": 100.0,
                "partial_signature": 100.0,
                "replay": 100.0,
                "forgery": 100.0
            },
            "observation": "Consuming application-level transaction nonces completely blocks replay attacks (+100 pp). All 6 attack classes blocked (100%)."
        }
    ]

    @classmethod
    def get_ablation_matrix(cls) -> List[Dict[str, Any]]:
        return cls.ABLATION_TABLE

    @classmethod
    def evaluate_custom_configuration(
        cls,
        key_binding: bool,
        domain_separation: bool,
        versioning: bool,
        and_verification: bool,
        replay_protection: bool
    ) -> Dict[str, Any]:
        """
        Dynamically evaluates attack resistance for any user-selected combination of controls.
        """
        blocked_rates = {
            "key_misbinding": 100.0 if key_binding else 0.0,
            "cross_domain": 100.0,  # Blocked by default digest checks
            "downgrade": 100.0,     # Blocked by strict typing / allow-list
            "partial_signature": 100.0 if and_verification else 0.0,
            "replay": 100.0 if replay_protection else 0.0,
            "forgery": 100.0        # Cryptographic unforgeability
        }

        total_blocked = sum(blocked_rates.values()) / len(blocked_rates)

        return {
            "controls": {
                "key_binding": key_binding,
                "domain_separation": domain_separation,
                "versioning": versioning,
                "and_verification": and_verification,
                "replay_protection": replay_protection
            },
            "blocked_rates": blocked_rates,
            "composite_score": round(total_blocked, 1),
            "vulnerabilities": [
                k for k, v in blocked_rates.items() if v < 100.0
            ]
        }

