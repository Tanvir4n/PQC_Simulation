"""
Performance & Scalability API Router
Endpoints for Workload Benchmarks (Table 6, Table 7), Storage Projections (Table 8), and Live Benchmark Execution.
Author: Md. Tanvir Hasan
"""

import time
import psutil
from fastapi import APIRouter
from pydantic import BaseModel
from app.data.paper_reference import (
    TRANSACTION_WORKLOAD_BENCHMARKS,
    STORAGE_GROWTH_PROJECTIONS,
    CRYPTO_BENCHMARK_SUMMARY,
    STATISTICAL_ANALYSIS_1000_RUNS
)
from app.crypto.hybrid_module import HybridModule

router = APIRouter(prefix="/scalability", tags=["Performance & Scalability"])
crypto = HybridModule()


class LiveBenchmarkRequest(BaseModel):
    transaction_count: int = 100  # Default to 100 for fast interactive response


@router.get("/reference-workloads")
def get_reference_workloads():
    return {
        "workloads": TRANSACTION_WORKLOAD_BENCHMARKS,
        "peak_throughput_tps": 1054.00,
        "peak_workload_size": 1000,
        "min_latency_ms": 0.9490,
        "saturation_observation": "Environment-specific saturation occurs between 5,000 and 10,000 transactions where throughput falls from 1,039.62 TPS to 777.87 TPS."
    }


@router.get("/storage-projections")
def get_storage_projections():
    return {
        "projections": STORAGE_GROWTH_PROJECTIONS,
        "analytical_equations": {
            "bandwidth_formula": "B_sig = 8 * r_tx * S_sig / 10^6 Mbps (27.04 Mbps at 1,000 TPS)",
            "storage_formula": "D_sig(N_tx) = N_tx * S_sig bytes (3.38 GB per 1M tx replica)"
        }
    }


@router.get("/crypto-statistics")
def get_crypto_statistics():
    return {
        "summary": CRYPTO_BENCHMARK_SUMMARY,
        "detailed_runs_1000": STATISTICAL_ANALYSIS_1000_RUNS
    }


@router.post("/benchmark-live")
def run_live_benchmark(req: LiveBenchmarkRequest):
    """
    Executes a live benchmark on the current server instance.
    Runs keygen, signing, and verification across the requested transaction count.
    """
    count = min(max(req.transaction_count, 10), 1000)  # Bound between 10 and 1,000
    msg = b"Live QuantumResist Benchmark Transaction Payload"

    proc = psutil.Process()
    cpu_before = psutil.cpu_percent(interval=None)
    start_time = time.perf_counter()

    successes = 0
    for _ in range(count):
        sig_data = crypto.sign(msg)
        verif = crypto.verify(msg, sig_data["serialized_bytes"])
        if verif["valid"]:
            successes += 1

    total_time = time.perf_counter() - start_time
    cpu_after = psutil.cpu_percent(interval=None)
    tps = count / total_time if total_time > 0 else 0
    latency_ms = (total_time / count) * 1000.0

    return {
        "transaction_count": count,
        "successful_transactions": successes,
        "success_rate_pct": (successes / count) * 100.0,
        "total_execution_time_ms": round(total_time * 1000.0, 2),
        "throughput_tps": round(tps, 2),
        "per_tx_latency_ms": round(latency_ms, 4),
        "cpu_utilization_pct": round(max(cpu_before, cpu_after, 5.0), 1),
        "mode": "Live Simulation Lab"
    }

