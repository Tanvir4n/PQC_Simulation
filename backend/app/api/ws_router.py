"""
WebSocket API Router
Streams live network packet hops and mempool events to the frontend.
Author: Md. Tanvir Hasan
"""

import asyncio
import random
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.simulation.network import network_topology
from app.blockchain.blockchain import shared_blockchain

router = APIRouter(prefix="/ws", tags=["Realtime WebSocket"])


@router.websocket("/network-stream")
async def network_stream(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Generate random packet transmission between peers
            nodes = list(network_topology.nodes.values())
            if len(nodes) >= 2:
                src = random.choice(nodes)
                dst = random.choice([n for n in nodes if n.node_id != src.node_id])
                route_res = network_topology.simulate_transaction_route(src.node_id, dst.node_id)
                
                packet_event = {
                    "event": "packet_routed",
                    "sender_id": src.node_id,
                    "receiver_id": dst.node_id,
                    "sender_type": src.node_type,
                    "receiver_type": dst.node_type,
                    "success": route_res["success"],
                    "hops": route_res["hops"],
                    "latency_ms": route_res["total_latency_ms"],
                    "rejection_reason": route_res.get("rejection_reason"),
                    "mempool_size": len(shared_blockchain.mempool)
                }
                await websocket.send_text(json.dumps(packet_event))
            
            await asyncio.sleep(2.5)  # Send event every 2.5 seconds
    except WebSocketDisconnect:
        pass
    except Exception:
        pass

