"""
Blockchain API Router
Endpoints for Mempool status, Block mining, Merkle tree visualizer, and Transactions.
Author: Md. Tanvir Hasan
"""

import random
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from app.blockchain.blockchain import shared_blockchain
from app.blockchain.transaction import Transaction
from app.blockchain.merkle import MerkleTree
from app.crypto.hybrid_module import HybridModule

router = APIRouter(prefix="/blockchain", tags=["Blockchain"])
crypto = HybridModule()


class TxSubmitRequest(BaseModel):
    sender: str
    receiver: str
    amount: float
    tx_type: str = "hybrid"
    nonce: Optional[int] = None


class MerkleBuildRequest(BaseModel):
    hashes: List[str]


@router.get("/status")
def get_blockchain_status():
    return shared_blockchain.get_mempool_info()


@router.get("/blocks")
def get_blocks(limit: int = 10):
    return shared_blockchain.get_latest_blocks(limit)


@router.post("/submit")
def submit_transaction(req: TxSubmitRequest):
    expected_nonce = shared_blockchain.nonces.get(req.sender, 0)
    nonce = req.nonce if req.nonce is not None else expected_nonce

    tx = Transaction(
        sender=req.sender,
        receiver=req.receiver,
        amount=req.amount,
        nonce=nonce,
        tx_type=req.tx_type
    )

    # Sign transaction with hybrid module
    sig_data = crypto.sign(tx.payload_bytes())
    tx.signature_hex = sig_data["serialized_hex"]

    accepted, msg = shared_blockchain.submit_transaction(tx)
    return {
        "accepted": accepted,
        "message": msg,
        "transaction": tx.to_dict()
    }


@router.post("/generate-batch")
def generate_sample_transactions(count: int = 5):
    """Generates a batch of sample incoming transactions for the mempool."""
    sample_addresses = [
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
        "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"
    ]
    created = []
    for _ in range(count):
        sender = random.choice(sample_addresses)
        receiver = random.choice([a for a in sample_addresses if a != sender])
        amt = round(random.uniform(0.5, 50.0), 3)
        nonce = shared_blockchain.nonces.get(sender, 0)

        tx = Transaction(sender, receiver, amt, nonce=nonce, tx_type="hybrid")
        sig_data = crypto.sign(tx.payload_bytes())
        tx.signature_hex = sig_data["serialized_hex"]

        shared_blockchain.submit_transaction(tx)
        created.append(tx.to_dict())

    return {
        "generated_count": len(created),
        "mempool_total": len(shared_blockchain.mempool),
        "transactions": created
    }


@router.post("/mine")
def mine_block(max_tx: int = 10):
    block = shared_blockchain.mine_block(max_tx)
    return {
        "mined": True,
        "block": block.to_dict()
    }


@router.post("/merkle")
def build_merkle_tree(req: MerkleBuildRequest):
    """
    Builds full Merkle Tree for interactive SVG / Node diagram inspection.
    """
    tree = MerkleTree(req.hashes)
    return tree.to_dict()

