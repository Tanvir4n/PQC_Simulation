"""
Migration API Router
Endpoints for Seven-Phase Migration (P1 to P7) and compatibility modeling.
Author: Md. Tanvir Hasan
"""

from fastapi import APIRouter
from pydantic import BaseModel
from app.migration.migration_engine import MigrationEngine

router = APIRouter(prefix="/migration", tags=["Migration Simulation"])


class SimRequest(BaseModel):
    classical_pct: float
    hybrid_pct: float
    pqc_pct: float
    num_trials: int = 1000


@router.get("/phases")
def get_reference_phases():
    return {
        "phases": MigrationEngine.get_reference_phases(),
        "directional_policy": {
            "C_to_C": "Accept",
            "C_to_H": "Accept",
            "H_to_H": "Accept",
            "H_to_C": "Reject (Incompatible: Classical cannot parse ML-DSA-65)",
            "H_to_P": "Accept",
            "P_to_P": "Accept",
            "P_to_C": "Reject"
        },
        "formula": "P_compat = 1 - p_H * p_C (at equal 50/50 parity, compatibility = 75%)"
    }


@router.post("/simulate")
def run_live_migration(req: SimRequest):
    return MigrationEngine.run_live_simulation(
        req.classical_pct,
        req.hybrid_pct,
        req.pqc_pct,
        req.num_trials
    )


@router.get("/compatibility-curve")
def get_compatibility_curve():
    """Generates 21 curve points showing the parity dip from 0% to 100% hybrid."""
    points = []
    for h in range(0, 105, 5):
        h_ratio = h / 100.0
        c_ratio = 1.0 - h_ratio
        # Formula: 1 - h*c
        compat = round((1.0 - (h_ratio * c_ratio)) * 100.0, 2)
        points.append({
            "hybrid_pct": h,
            "classical_pct": 100 - h,
            "compatibility_pct": compat
        })
    return {"curve_points": points}

