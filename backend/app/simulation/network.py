"""
100-Node Blockchain Network Simulation Engine
Generates graph topology with Classical, Hybrid, and PQC nodes.
Evaluates directed routing policy and hop-by-hop latency.

Paper: 'A Secure and Scalable Hybrid Classical-Post-Quantum Cryptographic Framework'
Author: Md. Tanvir Hasan
"""

import random
import math
import hashlib
from typing import List, Dict, Any, Tuple


class NodeSimulator:
    def __init__(self, node_id: int, node_type: str, x: float, y: float):
        self.node_id = node_id
        self.node_type = node_type  # "classical", "hybrid", "pqc"
        self.x = x
        self.y = y
        self.ip = f"192.168.{(node_id // 25) + 1}.{(node_id % 25) + 10}"
        
        # Address generation matching paper domain-separation
        seed = f"NODE-{node_id}-{node_type}".encode()
        self.address = "0x" + hashlib.sha256(b"HYB-ADDR:" + seed).hexdigest()[:40]
        self.peers: List[int] = []
        self.processed_tx = 0
        self.rejected_tx = 0

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": f"node-{self.node_id}",
            "numeric_id": self.node_id,
            "label": f"Node #{self.node_id:02d} ({self.node_type.upper()})",
            "type": self.node_type,
            "position": {"x": self.x, "y": self.y},
            "ip": self.ip,
            "address": self.address,
            "peers": self.peers,
            "processed_tx": self.processed_tx,
            "rejected_tx": self.rejected_tx
        }


class NetworkTopology:
    def __init__(self, num_nodes: int = 100, classical_pct: float = 0.5, hybrid_pct: float = 0.5, pqc_pct: float = 0.0):
        self.num_nodes = num_nodes
        self.nodes: Dict[int, NodeSimulator] = {}
        self.edges: List[Dict[str, Any]] = []
        self.generate_topology(classical_pct, hybrid_pct, pqc_pct)

    def generate_topology(self, c_ratio: float, h_ratio: float, p_ratio: float):
        self.nodes = {}
        self.edges = []

        total_ratio = c_ratio + h_ratio + p_ratio
        if total_ratio == 0:
            c_ratio, h_ratio, p_ratio = 0.5, 0.5, 0.0
            total_ratio = 1.0

        n_classical = int(round(self.num_nodes * (c_ratio / total_ratio)))
        n_hybrid = int(round(self.num_nodes * (h_ratio / total_ratio)))
        n_pqc = self.num_nodes - (n_classical + n_hybrid)

        types_list = (
            ["classical"] * n_classical +
            ["hybrid"] * n_hybrid +
            ["pqc"] * n_pqc
        )
        random.seed(42)  # Deterministic base layout
        random.shuffle(types_list)

        # Concentric spiral / clustered layout for 100 nodes (ideal for React Flow viewing)
        # Center hubs with outer satellite clusters
        num_clusters = 5
        cluster_centers = [
            (250 + 400 * math.cos(2 * math.pi * i / num_clusters), 
             250 + 400 * math.sin(2 * math.pi * i / num_clusters))
            for i in range(num_clusters)
        ]

        for i in range(self.num_nodes):
            cluster_idx = i % num_clusters
            cx, cy = cluster_centers[cluster_idx]
            
            # Position offset within cluster
            radius = 60 + (i // num_clusters) * 16
            angle = (i * 137.5) * (math.pi / 180.0)  # Golden ratio spiral
            x = cx + radius * math.cos(angle)
            y = cy + radius * math.sin(angle)

            node = NodeSimulator(i, types_list[i], round(x, 1), round(y, 1))
            self.nodes[i] = node

        # Connect nodes (small-world peer network: 3-5 neighbors per node)
        for i in range(self.num_nodes):
            # Connect to adjacent cluster nodes + 1 random long-range peer
            candidates = [(i + 1) % self.num_nodes, (i + num_clusters) % self.num_nodes]
            long_peer = (i + 17) % self.num_nodes
            candidates.append(long_peer)

            for cand in candidates:
                if cand != i and cand not in self.nodes[i].peers:
                    self.nodes[i].peers.append(cand)
                    if i not in self.nodes[cand].peers:
                        self.nodes[cand].peers.append(i)
                    self.edges.append({
                        "id": f"e{min(i, cand)}-{max(i, cand)}",
                        "source": f"node-{min(i, cand)}",
                        "target": f"node-{max(i, cand)}",
                        "delay_ms": round(random.uniform(1.2, 4.8), 2)
                    })

    def simulate_transaction_route(self, sender_id: int, receiver_id: int, tx_type: str = "hybrid") -> Dict[str, Any]:
        """
        Calculates path and applies directional compatibility policy:
        C -> C : ACCEPT
        C -> H : ACCEPT
        H -> H : ACCEPT
        H -> C : REJECT (Classical node cannot parse ML-DSA-65)
        P -> P : ACCEPT
        H -> P : ACCEPT
        P -> C : REJECT
        """
        sender = self.nodes.get(sender_id)
        receiver = self.nodes.get(receiver_id)
        if not sender or not receiver:
            return {"success": False, "error": "Invalid node ID"}

        # BFS shortest path
        queue = [[sender_id]]
        visited = {sender_id}
        path = []

        while queue:
            curr_path = queue.pop(0)
            last_node = curr_path[-1]
            if last_node == receiver_id:
                path = curr_path
                break
            for neighbor in self.nodes[last_node].peers:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(curr_path + [neighbor])

        if not path:
            path = [sender_id, receiver_id]

        # Check compatibility policy at each hop and receiver
        hops_info = []
        is_compatible = True
        rejection_reason = None

        curr_format = tx_type
        for idx in range(len(path) - 1):
            src_n = self.nodes[path[idx]]
            dst_n = self.nodes[path[idx + 1]]
            
            # Policy check:
            if curr_format == "hybrid" and dst_n.node_type == "classical":
                is_compatible = False
                rejection_reason = f"Incompatible: Classical receiver Node #{dst_n.node_id} cannot parse ML-DSA-65 component of Hybrid transaction."
                dst_n.rejected_tx += 1
                hops_info.append({
                    "from": src_n.node_id,
                    "to": dst_n.node_id,
                    "status": "REJECTED",
                    "reason": rejection_reason
                })
                break
            elif curr_format == "pqc" and dst_n.node_type == "classical":
                is_compatible = False
                rejection_reason = f"Incompatible: Classical receiver Node #{dst_n.node_id} cannot verify PQC-only transaction."
                dst_n.rejected_tx += 1
                hops_info.append({
                    "from": src_n.node_id,
                    "to": dst_n.node_id,
                    "status": "REJECTED",
                    "reason": rejection_reason
                })
                break
            else:
                dst_n.processed_tx += 1
                hops_info.append({
                    "from": src_n.node_id,
                    "to": dst_n.node_id,
                    "status": "ACCEPTED",
                    "latency_ms": round(random.uniform(0.8, 2.5), 2)
                })

        total_latency = sum(h.get("latency_ms", 1.0) for h in hops_info)

        return {
            "success": is_compatible,
            "sender": sender.to_dict(),
            "receiver": receiver.to_dict(),
            "path": [f"node-{nid}" for nid in path],
            "numeric_path": path,
            "hops": hops_info,
            "total_hops": len(path) - 1,
            "total_latency_ms": round(total_latency, 2),
            "rejection_reason": rejection_reason,
            "policy": "Asymmetric One-Way Migration Rule (Classical cannot parse ML-DSA-65)"
        }

    def get_topology_data(self) -> Dict[str, Any]:
        node_counts = {"classical": 0, "hybrid": 0, "pqc": 0}
        for n in self.nodes.values():
            node_counts[n.node_type] += 1

        return {
            "num_nodes": self.num_nodes,
            "composition": node_counts,
            "nodes": [n.to_dict() for n in self.nodes.values()],
            "edges": self.edges
        }


# Global network simulator instance
network_topology = NetworkTopology(100, 0.5, 0.5, 0.0)

