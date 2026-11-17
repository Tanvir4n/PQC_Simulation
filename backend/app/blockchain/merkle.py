"""
Merkle Tree Implementation using SHA3-512
Constructs complete cryptographic binary tree for blockchain blocks.
Provides tree nodes and proofs for frontend visualization.
Author: Md. Tanvir Hasan
"""

import hashlib
from typing import List, Dict, Any


class MerkleTree:
    def __init__(self, leaves: List[str]):
        """
        leaves: List of transaction hex hashes
        """
        self.raw_leaves = leaves
        self.levels: List[List[str]] = []
        self.root = self.build_tree(leaves)

    @staticmethod
    def hash_pair(left: str, right: str) -> str:
        combined = bytes.fromhex(left) + bytes.fromhex(right)
        return hashlib.sha3_512(b"MERKLE-NODE:" + combined).hexdigest()

    def build_tree(self, leaves: List[str]) -> str:
        if not leaves:
            return hashlib.sha3_512(b"EMPTY-MERKLE-ROOT").hexdigest()

        current_level = list(leaves)
        self.levels = [current_level]

        while len(current_level) > 1:
            next_level = []
            for i in range(0, len(current_level), 2):
                left = current_level[i]
                if i + 1 < len(current_level):
                    right = current_level[i + 1]
                else:
                    # Duplicate last element if odd number of leaves
                    right = left
                parent = self.hash_pair(left, right)
                next_level.append(parent)
            self.levels.append(next_level)
            current_level = next_level

        return current_level[0]

    def to_dict(self) -> Dict[str, Any]:
        """
        Export tree levels for interactive diagram visualization.
        """
        tree_nodes = []
        for level_idx, level in enumerate(self.levels):
            for node_idx, h in enumerate(level):
                tree_nodes.append({
                    "id": f"level_{level_idx}_node_{node_idx}",
                    "level": level_idx,
                    "index": node_idx,
                    "hash": h,
                    "short_hash": h[:8] + "..." + h[-8:],
                    "is_root": (level_idx == len(self.levels) - 1),
                    "is_leaf": (level_idx == 0)
                })

        return {
            "root": self.root,
            "leaf_count": len(self.raw_leaves),
            "depth": len(self.levels),
            "nodes": tree_nodes,
            "levels_count": len(self.levels)
        }

