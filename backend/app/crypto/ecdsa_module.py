"""
ECDSA Module (secp256k1)
Implements classical elliptic curve signatures used in Bitcoin and Ethereum.
Evaluated in 'A Secure and Scalable Hybrid Classical-Post-Quantum Cryptographic Framework'
Author: Md. Tanvir Hasan
"""

import time
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.serialization import (
    Encoding,
    PrivateFormat,
    PublicFormat,
    NoEncryption,
)
from cryptography.exceptions import InvalidSignature


class ECDSAModule:
    def __init__(self):
        self.private_key = None
        self.public_key = None

    def generate_keys(self):
        start = time.perf_counter_ns()
        self.private_key = ec.generate_private_key(ec.SECP256K1())
        self.public_key = self.private_key.public_key()
        elapsed_ms = (time.perf_counter_ns() - start) / 1_000_000.0
        return self.private_key, self.public_key, elapsed_ms

    def sign(self, message: bytes):
        if not self.private_key:
            self.generate_keys()
        start = time.perf_counter_ns()
        signature = self.private_key.sign(
            message,
            ec.ECDSA(hashes.SHA256())
        )
        elapsed_ms = (time.perf_counter_ns() - start) / 1_000_000.0
        return signature, elapsed_ms

    def verify(self, message: bytes, signature: bytes, public_key=None):
        pk = public_key if public_key is not None else self.public_key
        if not pk:
            return False, 0.0
        start = time.perf_counter_ns()
        try:
            pk.verify(
                signature,
                message,
                ec.ECDSA(hashes.SHA256())
            )
            elapsed_ms = (time.perf_counter_ns() - start) / 1_000_000.0
            return True, elapsed_ms
        except (InvalidSignature, Exception):
            elapsed_ms = (time.perf_counter_ns() - start) / 1_000_000.0
            return False, elapsed_ms

    def public_key_bytes(self):
        if not self.public_key:
            return b""
        return self.public_key.public_bytes(
            encoding=Encoding.X962,
            format=PublicFormat.UncompressedPoint
        )

    def private_key_bytes(self):
        if not self.private_key:
            return b""
        return self.private_key.private_bytes(
            encoding=Encoding.DER,
            format=PrivateFormat.PKCS8,
            encryption_algorithm=NoEncryption()
        )

    def public_key_size(self):
        return len(self.public_key_bytes())

    def private_key_size(self):
        # Algorithm level raw scalar is 32 bytes; serialized DER is ~135 bytes
        return len(self.private_key_bytes())

    @staticmethod
    def signature_size(signature: bytes):
        return len(signature)

