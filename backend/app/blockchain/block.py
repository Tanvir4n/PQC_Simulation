"""
Block Model for Hybrid Blockchain
Evaluated in 'A Secure and Scalable Hybrid Classical-Post-Quantum Cryptographic Framework'
Author: Md. Tanvir Hasan
"""

import hashlib
import json
import time
from typing import List, Dict, Any
from app.blockchain.merkle import MerkleTree
from app.blockchain.transaction import Transaction


class Block:
    def __init__(
        self,
        index: int,
        previous_hash: str,
        transactions: List[Transaction],
        nonce: int = 0
    ):
        self.index = index
        self.previous_hash = previous_hash
        self.transactions = transactions
        self.timestamp = time.time()
        self.nonce = nonce

        # Compute Merkle Root using SHA3-512
        tx_hashes = [tx.tx_id for tx in transactions]
        self.merkle_tree = MerkleTree(tx_hashes)
        self.merkle_root = self.merkle_tree.root
        self.hash = self.calculate_hash()

    def calculate_hash(self) -> str:
        block_header = {
            "index": self.index,
            "previous_hash": self.previous_hash,
            "merkle_root": self.merkle_root,
            "timestamp": self.timestamp,
            "nonce": self.nonce,
            "tx_count": len(self.transactions)
        }
        raw_header = json.dumps(block_header, sort_keys=True).encode()
        return hashlib.sha3_512(raw_header).hexdigest()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "index": self.index,
            "hash": self.hash,
            "previous_hash": self.previous_hash,
            "merkle_root": self.merkle_root,
            "timestamp": self.timestamp,
            "nonce": self.nonce,
            "tx_count": len(self.transactions),
            "size_kb": round((len(self.transactions) * 3.38) + 0.5, 2),  # ~3.38KB per hybrid tx
            "transactions": [tx.to_dict() for tx in self.transactions]
        }

