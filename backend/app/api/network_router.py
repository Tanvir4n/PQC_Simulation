"""
Network Simulation API Router
Endpoints for 100-node topology, directed packet routing, and node composition.
Author: Md. Tanvir Hasan
"""

from fastapi import APIRouter
from pydantic import BaseModel
from app.simulation.network import network_topology

router = APIRouter(prefix="/network", tags=["Network Simulation"])


class RouteRequest(BaseModel):
    sender_id: int
    receiver_id: int
    tx_type: str = "hybrid"  # "classical", "hybrid", "pqc"


class UpdateRatiosRequest(BaseModel):
    classical_pct: float = 0.5
    hybrid_pct: float = 0.5
    pqc_pct: float = 0.0


@router.get("/topology")
def get_topology():
    return network_topology.get_topology_data()


@router.post("/route")
def simulate_route(req: RouteRequest):
    return network_topology.simulate_transaction_route(
        req.sender_id,
        req.receiver_id,
        req.tx_type
    )


@router.post("/update-ratios")
def update_node_ratios(req: UpdateRatiosRequest):
    network_topology.generate_topology(
        req.classical_pct,
        req.hybrid_pct,
        req.pqc_pct
    )
    return network_topology.get_topology_data()

