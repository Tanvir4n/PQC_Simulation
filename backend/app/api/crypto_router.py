"""
Crypto API Router
Endpoints for key generation, hybrid signing, strict AND verification, and envelope breakdown.
Author: Md. Tanvir Hasan
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.crypto.hybrid_module import HybridModule

router = APIRouter(prefix="/crypto", tags=["Cryptography"])
crypto_engine = HybridModule()


class SignRequest(BaseModel):
    message: str = "Hybrid Classical-Post-Quantum Blockchain Transaction"


class VerifyRequest(BaseModel):
    message: str
    signature_hex: str


class TamperRequest(BaseModel):
    message: str
    signature_hex: str
    tamper_target: str = "ecdsa"  # "ecdsa", "mldsa", "version", "payload"


@router.post("/keygen")
def generate_hybrid_keys():
    """Algorithm 1: Generates ECDSA + ML-DSA-65 keys and binds them to an address."""
    result = crypto_engine.generate_keys()
    return {
        "success": True,
        "address": result["address"],
        "metrics": result
    }


@router.post("/sign")
def sign_hybrid_message(req: SignRequest):
    """Algorithm 2: Signs with both ECDSA and ML-DSA-65, produces 3380B envelope."""
    msg_bytes = req.message.encode("utf-8")
    sig_data = crypto_engine.sign(msg_bytes)
    return {
        "success": True,
        "message": req.message,
        "signature": sig_data
    }


@router.post("/verify")
def verify_hybrid_signature(req: VerifyRequest):
    """Algorithm 3: Strict conjunction (be AND bpq) verification."""
    try:
        sig_bytes = bytes.fromhex(req.signature_hex)
        msg_bytes = req.message.encode("utf-8")
        result = crypto_engine.verify(msg_bytes, sig_bytes)
        return {
            "success": True,
            "verification": result
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/tamper")
def tamper_and_test(req: TamperRequest):
    """
    Tampering Sandbox: Modifies a byte or field and verifies immediate rejection.
    """
    try:
        sig_bytes = bytearray(bytes.fromhex(req.signature_hex))
        msg_bytes = req.message.encode("utf-8")

        tamper_desc = ""
        if req.tamper_target == "version":
            sig_bytes[0] ^= 0x02
            tamper_desc = "Flipped version byte 0x01 -> 0x03"
        elif req.tamper_target == "ecdsa":
            # Tamper byte in ECDSA DER region (e.g. byte 5)
            sig_bytes[5] ^= 0xFF
            tamper_desc = "Flipped 8 bits in ECDSA DER sequence at byte index 5"
        elif req.tamper_target == "mldsa":
            # Tamper byte in ML-DSA-65 region
            sig_bytes[-100] ^= 0x55
            tamper_desc = "Flipped bits in ML-DSA-65 post-quantum signature string at offset -100"
        elif req.tamper_target == "payload":
            msg_bytes = (req.message + " [TAMPERED_PAYLOAD]").encode("utf-8")
            tamper_desc = "Modified transaction message payload in transit"

        verif = crypto_engine.verify(msg_bytes, bytes(sig_bytes))
        return {
            "tamper_target": req.tamper_target,
            "tamper_description": tamper_desc,
            "accepted": verif["valid"],
            "rejection_effective": not verif["valid"],
            "verification_result": verif
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

