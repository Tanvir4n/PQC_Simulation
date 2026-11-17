"""
EVM API Router
Endpoints for Anvil EVM status, HybridAuth contract gas metrics, and 5 functional test scenarios.
Author: Md. Tanvir Hasan
"""

from fastapi import APIRouter
from app.evm.evm_bridge import evm_bridge

router = APIRouter(prefix="/evm", tags=["EVM Integration"])


@router.get("/status")
def get_evm_status():
    return evm_bridge.get_status()


@router.get("/scenarios")
def get_evm_scenarios():
    return {
        "scenarios": evm_bridge.run_five_functional_scenarios(),
        "deployment_gas": evm_bridge.DEPLOYMENT_GAS,
        "accepted_tx_gas": evm_bridge.ACCEPTED_TX_GAS,
        "scientific_integrity_note": "The contract verifies sender nonces, replay guards, and caller-supplied boolean outcomes. Off-chain ML-DSA verification runs in Python layer; not an on-chain lattice precompile."
    }

