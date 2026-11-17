"""
Hybrid Blockchain Ledger & Mempool Manager
Implements chain state, transaction pool, duplicate rejection, and mining.
Evaluated in 'A Secure and Scalable Hybrid Classical-Post-Quantum Cryptographic Framework'
Author: Md. Tanvir Hasan
"""

import time
from typing import List, Dict, Any, Tuple
from app.blockchain.block import Block
from app.blockchain.transaction import Transaction


class Blockchain:
    def __init__(self):
        self.chain: List[Block] = []
        self.mempool: List[Transaction] = []
        self.transaction_pool_set = set()  # Fast hash lookup for duplicate detection
        self.nonces: Dict[str, int] = {}    # Sender -> nonce tracking
        self.total_tx_count = 0
        self.rejected_duplicates = 0
        self.create_genesis()

    def create_genesis(self):
        genesis_tx = Transaction(
            sender="0x0000000000000000000000000000000000000000",
            receiver="0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            amount=1000.0,
            tx_type="genesis"
        )
        genesis_block = Block(
            index=0,
            previous_hash="0" * 128,  # SHA3-512 has 128 hex chars
            transactions=[genesis_tx],
            nonce=0
        )
        self.chain.append(genesis_block)

    def submit_transaction(self, tx: Transaction) -> Tuple[bool, str]:
        """
        Duplicate transaction detection and mempool queuing.
        """
        if tx.tx_id in self.transaction_pool_set:
            self.rejected_duplicates += 1
            return False, f"Duplicate transaction rejected: {tx.tx_id[:16]}..."

        # Nonce verification if tracked
        expected_nonce = self.nonces.get(tx.sender, 0)
        if tx.nonce < expected_nonce:
            return False, f"Invalid nonce: submitted {tx.nonce}, expected {expected_nonce}"

        self.transaction_pool_set.add(tx.tx_id)
        self.mempool.append(tx)
        return True, "Queued in Mempool"

    def mine_block(self, max_tx: int = 10) -> Block:
        """
        Assemble candidate block from mempool and append to chain.
        """
        if not self.mempool:
            # Produce empty heartbeat block or return latest
            txs = []
        else:
            txs = self.mempool[:max_tx]
            self.mempool = self.mempool[max_tx:]

        # Update sender nonces
        for tx in txs:
            self.nonces[tx.sender] = tx.nonce + 1
            self.total_tx_count += 1

        prev_hash = self.chain[-1].hash
        new_block = Block(
            index=len(self.chain),
            previous_hash=prev_hash,
            transactions=txs,
            nonce=int(time.time() * 1000) % 100000
        )
        self.chain.append(new_block)
        return new_block

    def get_latest_blocks(self, count: int = 10) -> List[Dict[str, Any]]:
        return [b.to_dict() for b in reversed(self.chain[-count:])]

    def get_mempool_info(self) -> Dict[str, Any]:
        return {
            "mempool_count": len(self.mempool),
            "mempool_size_kb": round(len(self.mempool) * 3.38, 2),
            "total_chain_blocks": len(self.chain),
            "total_processed_tx": self.total_tx_count,
            "rejected_duplicates": self.rejected_duplicates,
            "pending_transactions": [tx.to_dict() for tx in self.mempool[:20]]
        }


# Global singleton ledger instance
shared_blockchain = Blockchain()

