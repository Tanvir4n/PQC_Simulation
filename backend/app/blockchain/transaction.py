"""
Transaction Model for Hybrid Blockchain
Evaluated in 'A Secure and Scalable Hybrid Classical-Post-Quantum Cryptographic Framework'
Author: Md. Tanvir Hasan
"""

import hashlib
import json
import time
from typing import Optional, Dict, Any


class Transaction:
    def __init__(
        self,
        sender: str,
        receiver: str,
        amount: float,
        nonce: int = 0,
        tx_type: str = "hybrid",  # "classical", "hybrid", "pqc"
        signature_hex: Optional[str] = None,
        public_key_hex: Optional[str] = None
    ):
        self.sender = sender
        self.receiver = receiver
        self.amount = amount
        self.nonce = nonce
        self.tx_type = tx_type
        self.timestamp = time.time()
        self.signature_hex = signature_hex
        self.public_key_hex = public_key_hex
        self.tx_id = self.calculate_hash()

    def payload_bytes(self) -> bytes:
        payload = {
            "sender": self.sender,
            "receiver": self.receiver,
            "amount": self.amount,
            "nonce": self.nonce,
            "timestamp": self.timestamp,
            "tx_type": self.tx_type
        }
        return json.dumps(payload, sort_keys=True).encode()

    def calculate_hash(self) -> str:
        return hashlib.sha3_512(self.payload_bytes()).hexdigest()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "tx_id": self.tx_id,
            "sender": self.sender,
            "receiver": self.receiver,
            "amount": self.amount,
            "nonce": self.nonce,
            "tx_type": self.tx_type,
            "timestamp": self.timestamp,
            "signature_hex": self.signature_hex,
            "size_bytes": len(bytes.fromhex(self.signature_hex)) if self.signature_hex else 3380
        }

