"""
Security API Router
Endpoints for Protocol Ablation Matrix (Table 11) and 6 Attack Scenarios.
Author: Md. Tanvir Hasan
"""

from fastapi import APIRouter
from pydantic import BaseModel
from app.security.ablation_engine import AblationEngine
from app.security.attack_simulator import attack_simulator

router = APIRouter(prefix="/security", tags=["Security & Attacks"])


class CustomAblationRequest(BaseModel):
    key_binding: bool = True
    domain_separation: bool = True
    versioning: bool = True
    and_verification: bool = True
    replay_protection: bool = True


class AttackOptionRequest(BaseModel):
    enable_defense: bool = True
    target_component: str = "ecdsa"  # for signature forgery: "ecdsa" or "mldsa"


@router.get("/ablation-matrix")
def get_ablation_matrix():
    return {
        "configurations": AblationEngine.get_ablation_matrix(),
        "attack_classes": [
            "Key-Misbinding",
            "Cross-Domain",
            "Downgrade",
            "Partial-Signature",
            "Replay",
            "Forgery"
        ],
        "formal_reductions": {
            "classical_euf_cma": "Adv_H^C(A_C) <= min{Adv_e^C(B_e), Adv_pq^C(B_pq)} + eps_coll^C",
            "quantum_euf_cmaq": "Adv_H^Q(A_Q) <= Adv_pq^Q(B_pq^Q) + eps_coll^Q (Unforgeable even under total ECDSA key compromise)"
        }
    }


@router.post("/ablation-evaluate")
def evaluate_custom_ablation(req: CustomAblationRequest):
    return AblationEngine.evaluate_custom_configuration(
        req.key_binding,
        req.domain_separation,
        req.versioning,
        req.and_verification,
        req.replay_protection
    )


@router.post("/attack/replay")
def trigger_replay_attack(req: AttackOptionRequest):
    return attack_simulator.run_replay_attack(enable_replay_protection=req.enable_defense)


@router.post("/attack/forgery")
def trigger_forgery_attack(req: AttackOptionRequest):
    return attack_simulator.run_signature_forgery_attack(target_component=req.target_component)


@router.post("/attack/mitm")
def trigger_mitm_attack():
    return attack_simulator.run_mitm_tampering_attack()


@router.post("/attack/duplicate")
def trigger_duplicate_attack():
    return attack_simulator.run_duplicate_insertion_attack()


@router.post("/attack/key-misbinding")
def trigger_key_misbinding_attack(req: AttackOptionRequest):
    return attack_simulator.run_key_misbinding_attack(enable_key_binding=req.enable_defense)

