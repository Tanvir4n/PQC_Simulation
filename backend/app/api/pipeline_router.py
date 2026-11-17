"""
Pipeline API Router
Simulates the end-to-end transaction lifecycle from creation to final on-chain confirmation.
Paper: 'A Secure and Scalable Hybrid Classical-Post-Quantum Cryptographic Framework'
Author: Md. Tanvir Hasan (Daffodil International University)
"""

import time
import random
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any, List

from app.crypto.hybrid_module import HybridModule
from app.blockchain.blockchain import shared_blockchain
from app.blockchain.transaction import Transaction
from app.blockchain.merkle import MerkleTree
from app.simulation.network import network_topology
from app.evm.evm_bridge import evm_bridge

router = APIRouter(prefix="/pipeline", tags=["Pipeline Simulator"])
crypto = HybridModule()


class PipelineSimulateRequest(BaseModel):
    sender: Optional[str] = None
    receiver: Optional[str] = None
    amount: float = 12.50
    tamper_mode: str = "none"  # "none", "ecdsa_tamper", "mldsa_tamper", "replay_nonce", "envelope_tamper"


@router.post("/simulate")
def run_end_to_end_simulation(req: PipelineSimulateRequest):
    """
    Executes the complete 8-stage hybrid transaction lifecycle:
    Stage 1: Transaction Creation & Payload Construction
    Stage 2: Key Generation & Dual Identity Binding (Algorithm 1)
    Stage 3: Hybrid Dual Signing & 3,380B Envelope Serialization (Algorithm 2)
    Stage 4: 100-Node Network Routing & Propagation
    Stage 5: Mempool Ingestion & Replay Guard Validation
    Stage 6: Strict Conjunction (AND) Verification (Algorithm 3)
    Stage 7: Consensus Block Proposal & SHA3-512 Merkle Tree Assembly
    Stage 8: On-Chain State Finalization & EVM Smart Contract Execution
    """
    t_start = time.perf_counter()

    # --- Stage 1: Transaction Creation ---
    t1_start = time.perf_counter()
    default_sender = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    default_receiver = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
    sender = req.sender or default_sender
    receiver = req.receiver or default_receiver

    current_nonce = shared_blockchain.nonces.get(sender, 0)
    tx_nonce = current_nonce
    if req.tamper_mode == "replay_nonce":
        tx_nonce = max(0, current_nonce - 1)

    tx = Transaction(
        sender=sender,
        receiver=receiver,
        amount=req.amount,
        nonce=tx_nonce,
        tx_type="hybrid"
    )
    payload_bytes = tx.payload_bytes()
    t1_dur = (time.perf_counter() - t1_start) * 1000.0

    stage_1 = {
        "stage_num": 1,
        "name": "Transaction Creation & Payload Construction",
        "sender": sender,
        "receiver": receiver,
        "amount": req.amount,
        "nonce": tx_nonce,
        "current_account_nonce": current_nonce,
        "tx_id": tx.tx_id,
        "payload_length_bytes": len(payload_bytes),
        "duration_ms": round(t1_dur, 3),
        "status": "COMPLETED"
    }

    # --- Stage 2: Dual Key Generation & Public Key Binding ---
    t2_start = time.perf_counter()
    keygen_data = crypto.generate_keys()
    sizes = keygen_data.get("sizes", {})
    t2_dur = (time.perf_counter() - t2_start) * 1000.0

    stage_2 = {
        "stage_num": 2,
        "name": "Dual Key Generation & Public Key Binding (Algorithm 1)",
        "classical_curve": "ECDSA secp256k1 (256-bit)",
        "pqc_standard": "ML-DSA-65 (NIST FIPS 204 Parameter Set 2)",
        "classical_pk_bytes": sizes.get("ecdsa_pk_bytes", 65),
        "pqc_pk_bytes": sizes.get("pqc_pk_bytes", 1952),
        "total_pk_bytes": sizes.get("combined_pk_bytes", 2017),
        "bound_address": keygen_data.get("address", sender),
        "hash_binding": "Truncate_160(SHA-256(pk_e || pk_pq))",
        "duration_ms": round(t2_dur, 3),
        "status": "COMPLETED"
    }

    # --- Stage 3: Hybrid Dual Signing & Byte Envelope Packaging ---
    t3_start = time.perf_counter()
    signing_result = crypto.sign(payload_bytes)
    sig_hex = signing_result.get("serialized_hex", "")
    breakdown = signing_result.get("envelope_breakdown", {})

    tampered_desc = None
    if req.tamper_mode == "ecdsa_tamper":
        sig_bytes = bytearray(bytes.fromhex(sig_hex))
        sig_bytes[10] ^= 0xFF
        sig_hex = sig_bytes.hex()
        tampered_desc = "ECDSA signature component corrupted"
    elif req.tamper_mode == "mldsa_tamper":
        sig_bytes = bytearray(bytes.fromhex(sig_hex))
        sig_bytes[-50] ^= 0xFF
        sig_hex = sig_bytes.hex()
        tampered_desc = "ML-DSA-65 lattice signature component corrupted"
    elif req.tamper_mode == "envelope_tamper":
        sig_bytes = bytearray(bytes.fromhex(sig_hex))
        sig_bytes[0] = 0x99
        sig_hex = sig_bytes.hex()
        tampered_desc = "Envelope protocol version byte corrupted to 0x99"

    tx.signature_hex = sig_hex
    t3_dur = (time.perf_counter() - t3_start) * 1000.0

    stage_3 = {
        "stage_num": 3,
        "name": "Hybrid Dual Signing & Byte Envelope Serialization (Algorithm 2)",
        "version_byte": "0x01 (1 Byte)",
        "ecdsa_sig_bytes": breakdown.get("ecdsa_der_bytes", 70),
        "mldsa_sig_bytes": breakdown.get("mldsa_bytes", 3309),
        "total_envelope_bytes": signing_result.get("total_size_bytes", 3380),
        "domain_separator": "SHA3-512('HYB-SIG' || Enc(v, α_pk, m))",
        "serialized_hex_preview": f"{sig_hex[:32]}...{sig_hex[-16:]}" if len(sig_hex) > 48 else sig_hex,
        "tamper_injected": tampered_desc,
        "duration_ms": round(t3_dur, 3),
        "status": "COMPLETED"
    }

    # --- Stage 4: 100-Node Network Routing & Propagation ---
    t4_start = time.perf_counter()
    hybrid_node_ids = [nid for nid, n in network_topology.nodes.items() if n.node_type in ("hybrid", "pqc")]
    if len(hybrid_node_ids) >= 2:
        sender_node_id = random.choice(hybrid_node_ids[:len(hybrid_node_ids)//2])
        receiver_node_id = random.choice(hybrid_node_ids[len(hybrid_node_ids)//2:])
    else:
        sender_node_id = 0
        receiver_node_id = 1

    route_sim = network_topology.simulate_transaction_route(
        sender_node_id,
        receiver_node_id,
        "hybrid"
    )
    t4_dur = (time.perf_counter() - t4_start) * 1000.0

    total_hops = route_sim.get("total_hops", 3)
    net_lat = route_sim.get("total_latency_ms", 1.25)

    stage_4 = {
        "stage_num": 4,
        "name": "100-Node Network P2P Mesh Routing & Packet Flight",
        "sender_node": sender_node_id,
        "receiver_node": receiver_node_id,
        "path": route_sim.get("numeric_path", [sender_node_id, receiver_node_id]),
        "hops": total_hops,
        "network_latency_ms": net_lat,
        "packet_size_bytes": 3380,
        "bandwidth_kb": round(3380 * total_hops / 1024.0, 2),
        "route_status": "SUCCESS" if route_sim.get("success", True) else "REJECTED",
        "duration_ms": round(t4_dur, 3),
        "status": "COMPLETED"
    }

    # --- Stage 5: Mempool Ingestion & Anti-Replay Guard Validation ---
    t5_start = time.perf_counter()
    mempool_accepted = True
    rejection_reason = None

    if req.tamper_mode == "replay_nonce" or tx_nonce < current_nonce:
        mempool_accepted = False
        rejection_reason = f"Anti-Replay Guard Violation: Nonce {tx_nonce} < current nonce {current_nonce}"
    elif tx.tx_id in shared_blockchain.transaction_pool_set:
        mempool_accepted = False
        rejection_reason = f"Duplicate Transaction Filter: tx_id {tx.tx_id[:16]}... already pooled"

    if mempool_accepted:
        shared_blockchain.transaction_pool_set.add(tx.tx_id)
        shared_blockchain.mempool.append(tx)

    t5_dur = (time.perf_counter() - t5_start) * 1000.0

    stage_5 = {
        "stage_num": 5,
        "name": "Mempool Ingestion & Anti-Replay Guard Validation",
        "accepted": mempool_accepted,
        "rejection_reason": rejection_reason,
        "mempool_queue_depth": len(shared_blockchain.mempool),
        "duplicate_pool_size": len(shared_blockchain.transaction_pool_set),
        "nonce_check": f"Submitted {tx_nonce} == Expected {current_nonce}",
        "duration_ms": round(t5_dur, 3),
        "status": "COMPLETED" if mempool_accepted else "REJECTED"
    }

    if not mempool_accepted:
        t_total = (time.perf_counter() - t_start) * 1000.0
        return {
            "success": False,
            "overall_status": "REJECTED_AT_MEMPOOL",
            "rejected_at_stage": 5,
            "error_message": rejection_reason,
            "total_duration_ms": round(t_total, 3),
            "stages": [stage_1, stage_2, stage_3, stage_4, stage_5]
        }

    # --- Stage 6: Strict Conjunction (AND) Dual Verification (Algorithm 3) ---
    t6_start = time.perf_counter()
    try:
        verif_result = crypto.verify(payload_bytes, bytes.fromhex(sig_hex))
        ecdsa_valid = verif_result.get("ecdsa_valid", False)
        mldsa_valid = verif_result.get("pqc_valid", False)
        strict_and_valid = verif_result.get("valid", False)
    except Exception as e:
        ecdsa_valid = False
        mldsa_valid = False
        strict_and_valid = False

    t6_dur = (time.perf_counter() - t6_start) * 1000.0

    stage_6 = {
        "stage_num": 6,
        "name": "Strict Conjunction Dual Verification (Algorithm 3)",
        "formula": "b_final = b_e ∧ b_pq",
        "ecdsa_valid": ecdsa_valid,
        "mldsa_valid": mldsa_valid,
        "strict_and_valid": strict_and_valid,
        "security_assurance": "Zero-compromise: Quantum adversary breaking ECDSA fails ML-DSA-65 gate; classical attacker fails ECDSA gate.",
        "duration_ms": round(t6_dur, 3),
        "status": "COMPLETED" if strict_and_valid else "FAILED_VERIFICATION"
    }

    if not strict_and_valid:
        if tx in shared_blockchain.mempool:
            shared_blockchain.mempool.remove(tx)
        t_total = (time.perf_counter() - t_start) * 1000.0
        fail_msg = "Cryptographic Verification Failed: "
        if not ecdsa_valid and not mldsa_valid:
            fail_msg += "Both ECDSA and ML-DSA components failed."
        elif not ecdsa_valid:
            fail_msg += "ECDSA classical verification failed (b_e = 0)."
        else:
            fail_msg += "ML-DSA-65 post-quantum lattice verification failed (b_pq = 0)."

        return {
            "success": False,
            "overall_status": "REJECTED_AT_VERIFICATION",
            "rejected_at_stage": 6,
            "error_message": fail_msg,
            "total_duration_ms": round(t_total, 3),
            "stages": [stage_1, stage_2, stage_3, stage_4, stage_5, stage_6]
        }

    # --- Stage 7: Consensus Block Proposal & Merkle Tree Assembly ---
    t7_start = time.perf_counter()
    mined_block = shared_blockchain.mine_block(max_tx=10)
    tx_hashes = [t.tx_id for t in mined_block.transactions]
    merkle = MerkleTree(tx_hashes if tx_hashes else [tx.tx_id])
    t7_dur = (time.perf_counter() - t7_start) * 1000.0

    stage_7 = {
        "stage_num": 7,
        "name": "Consensus Block Proposal & SHA3-512 Merkle Tree Assembly",
        "block_height": mined_block.index,
        "block_hash": f"{mined_block.hash[:16]}...{mined_block.hash[-16:]}",
        "full_block_hash": mined_block.hash,
        "previous_hash": f"{mined_block.previous_hash[:16]}...{mined_block.previous_hash[-16:]}",
        "merkle_root": merkle.root,
        "transactions_included": len(mined_block.transactions),
        "consensus_nonce": mined_block.nonce,
        "duration_ms": round(t7_dur, 3),
        "status": "COMPLETED"
    }

    # --- Stage 8: On-Chain State Finalization & EVM Smart Contract Execution ---
    t8_start = time.perf_counter()
    new_nonce = current_nonce + 1
    shared_blockchain.nonces[sender] = new_nonce

    stage_8 = {
        "stage_num": 8,
        "name": "On-Chain State Finalization & EVM Smart Contract Execution",
        "contract_name": "HybridAuth.sol",
        "contract_address": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        "caller": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "gas_consumed": evm_bridge.ACCEPTED_TX_GAS,
        "deployment_baseline_gas": evm_bridge.DEPLOYMENT_GAS,
        "state_update": {
            "account": sender,
            "nonce_transition": f"{current_nonce} -> {new_nonce}",
            "amount_transferred": f"{req.amount} ETH",
            "settlement": "CONFIRMED_ON_CHAIN"
        },
        "receipt": {
            "status": "0x1 (SUCCESS)",
            "block_number": mined_block.index,
            "cumulative_gas_used": evm_bridge.ACCEPTED_TX_GAS,
            "confirmations": 1
        },
        "duration_ms": round((time.perf_counter() - t8_start) * 1000.0, 3),
        "status": "COMPLETED"
    }

    t_total = (time.perf_counter() - t_start) * 1000.0

    return {
        "success": True,
        "overall_status": "CONFIRMED_AND_FINALIZED",
        "total_duration_ms": round(t_total, 3),
        "summary": {
            "tx_id": tx.tx_id,
            "sender": sender,
            "receiver": receiver,
            "amount": req.amount,
            "block_index": mined_block.index,
            "gas_used": evm_bridge.ACCEPTED_TX_GAS,
            "envelope_bytes": 3380,
            "verification": "STRICT_AND_PASSED"
        },
        "stages": [
            stage_1,
            stage_2,
            stage_3,
            stage_4,
            stage_5,
            stage_6,
            stage_7,
            stage_8
        ]
    }
