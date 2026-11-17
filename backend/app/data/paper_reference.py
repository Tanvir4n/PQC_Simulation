"""
Published Empirical Research Data & Benchmark Reference Tables
Source: 'A Secure and Scalable Hybrid Classical-Post-Quantum Cryptographic Framework'
Author: Md. Tanvir Hasan (Daffodil International University)
"""

PAPER_METADATA = {
    "title": "A Secure and Scalable Hybrid Classical–Post-Quantum Cryptographic Framework for Quantum-Resilient Blockchain Systems",
    "author": "Md. Tanvir Hasan",
    "affiliation": "Department of Computer Science Engineering, Daffodil International University, Savar, Dhaka 1216, Bangladesh",
    "orcid": "0009-0008-9130-3360",
    "email": "hasan23105101461@diu.edu.bd",
    "classical_algorithm": "ECDSA over secp256k1",
    "pqc_algorithm": "ML-DSA-65 (NIST FIPS 204)",
    "hash_functions": {
        "canonical_signed_context": "SHA3-512",
        "block_hashing": "SHA3-512",
        "address_binding": "SHA-256"
    }
}

# Table 4 & Table 10: Digital Signature Performance & Representation Sizes
CRYPTO_BENCHMARK_SUMMARY = [
    {
        "method": "ECDSA Only",
        "key_gen_ms": 0.4398,
        "signing_ms": 0.4774,
        "verification_ms": 0.3985,
        "sig_enc_bytes": 70,
        "pk_enc_bytes": 65,
        "raw_sk_bytes": 32,
        "serialized_sk_bytes": 135,
        "classical_security": True,
        "quantum_security": False,
        "blockchain_compat": "Full (Native)"
    },
    {
        "method": "ML-DSA-65 Only",
        "key_gen_ms": 0.0550,
        "signing_ms": 0.1374,
        "verification_ms": 0.0624,
        "sig_enc_bytes": 3309,
        "pk_enc_bytes": 1952,
        "raw_sk_bytes": 4032,
        "serialized_sk_bytes": 4032,
        "classical_security": True,
        "quantum_security": True,
        "blockchain_compat": "Partial (Non-standard)"
    },
    {
        "method": "Proposed Hybrid",
        "key_gen_ms": 0.5488,
        "signing_ms": 0.6434,
        "verification_ms": 0.5248,
        "sig_enc_bytes": 3380,
        "pk_enc_bytes": 2017,
        "raw_sk_bytes": 4064,
        "serialized_sk_bytes": 4167,
        "classical_security": True,
        "quantum_security": True,
        "blockchain_compat": "Full (Dual-verified)"
    }
]

# Table 5: Statistical Analysis over 1,000 Benchmark Runs
STATISTICAL_ANALYSIS_1000_RUNS = [
    {
        "method": "ECDSA",
        "metric": "Key Generation",
        "mean_ms": 0.4398,
        "median_ms": 0.4249,
        "std_dev_ms": 0.0672,
        "min_ms": 0.3567,
        "max_ms": 0.9213,
        "ci_95": [0.4356, 0.4440]
    },
    {
        "method": "ECDSA",
        "metric": "Signing",
        "mean_ms": 0.4774,
        "median_ms": 0.4624,
        "std_dev_ms": 0.2911,
        "min_ms": 0.3682,
        "max_ms": 9.2990,
        "ci_95": [0.4593, 0.4955]
    },
    {
        "method": "ECDSA",
        "metric": "Verification",
        "mean_ms": 0.3985,
        "median_ms": 0.3849,
        "std_dev_ms": 0.0612,
        "min_ms": 0.3308,
        "max_ms": 0.7987,
        "ci_95": [0.3947, 0.4023]
    },
    {
        "method": "ML-DSA-65",
        "metric": "Key Generation",
        "mean_ms": 0.0550,
        "median_ms": 0.0487,
        "std_dev_ms": 0.0141,
        "min_ms": 0.0456,
        "max_ms": 0.1893,
        "ci_95": [0.0541, 0.0558]
    },
    {
        "method": "ML-DSA-65",
        "metric": "Signing",
        "mean_ms": 0.1374,
        "median_ms": 0.1133,
        "std_dev_ms": 0.0823,
        "min_ms": 0.0549,
        "max_ms": 0.5699,
        "ci_95": [0.1323, 0.1425]
    },
    {
        "method": "ML-DSA-65",
        "metric": "Verification",
        "mean_ms": 0.0624,
        "median_ms": 0.0570,
        "std_dev_ms": 0.0174,
        "min_ms": 0.0509,
        "max_ms": 0.3259,
        "ci_95": [0.0614, 0.0635]
    },
    {
        "method": "Proposed Hybrid",
        "metric": "Key Generation",
        "mean_ms": 0.5488,
        "median_ms": 0.5352,
        "std_dev_ms": 0.0885,
        "min_ms": 0.4383,
        "max_ms": 1.3114,
        "ci_95": [0.5433, 0.5543]
    },
    {
        "method": "Proposed Hybrid",
        "metric": "Signing",
        "mean_ms": 0.6434,
        "median_ms": 0.6043,
        "std_dev_ms": 0.1406,
        "min_ms": 0.4800,
        "max_ms": 1.4652,
        "ci_95": [0.6347, 0.6521]
    },
    {
        "method": "Proposed Hybrid",
        "metric": "Verification",
        "mean_ms": 0.5248,
        "median_ms": 0.5019,
        "std_dev_ms": 0.0969,
        "min_ms": 0.4250,
        "max_ms": 1.1111,
        "ci_95": [0.5188, 0.5308]
    }
]

# Table 6: Five-Run Hybrid Transaction Performance Under Increasing Workloads
TRANSACTION_WORKLOAD_BENCHMARKS = [
    {
        "workload_size": 100,
        "successful_mean": 100,
        "success_rate_pct": 100.0,
        "execution_time_ms_mean": 106.382,
        "execution_time_ms_sd": 6.623,
        "throughput_tps_mean": 943.03,
        "throughput_tps_sd": 60.69,
        "latency_ms_mean": 1.0638,
        "latency_ms_sd": 0.0662,
        "cpu_util_pct_mean": 80.11,
        "cpu_util_between_run_sd": 17.02
    },
    {
        "workload_size": 500,
        "successful_mean": 500,
        "success_rate_pct": 100.0,
        "execution_time_ms_mean": 485.084,
        "execution_time_ms_sd": 7.819,
        "throughput_tps_mean": 1030.96,
        "throughput_tps_sd": 16.47,
        "latency_ms_mean": 0.9702,
        "latency_ms_sd": 0.0156,
        "cpu_util_pct_mean": 103.95,
        "cpu_util_between_run_sd": 1.64
    },
    {
        "workload_size": 1000,
        "successful_mean": 1000,
        "success_rate_pct": 100.0,
        "execution_time_ms_mean": 948.961,
        "execution_time_ms_sd": 15.295,
        "throughput_tps_mean": 1054.00,  # Peak Throughput
        "throughput_tps_sd": 16.88,
        "latency_ms_mean": 0.9490,      # Minimum Latency
        "latency_ms_sd": 0.0153,
        "cpu_util_pct_mean": 106.09,
        "cpu_util_between_run_sd": 0.99
    },
    {
        "workload_size": 5000,
        "successful_mean": 5000,
        "success_rate_pct": 100.0,
        "execution_time_ms_mean": 4818.566,
        "execution_time_ms_sd": 240.512,
        "throughput_tps_mean": 1039.62,
        "throughput_tps_sd": 49.36,
        "latency_ms_mean": 0.9637,
        "latency_ms_sd": 0.0481,
        "cpu_util_pct_mean": 108.33,
        "cpu_util_between_run_sd": 0.32
    },
    {
        "workload_size": 10000,
        "successful_mean": 10000,
        "success_rate_pct": 100.0,
        "execution_time_ms_mean": 13406.933,
        "execution_time_ms_sd": 3219.034,
        "throughput_tps_mean": 777.87,
        "throughput_tps_sd": 167.29,
        "latency_ms_mean": 1.3407,
        "latency_ms_sd": 0.3219,
        "cpu_util_pct_mean": 108.31,
        "cpu_util_between_run_sd": 0.49
    }
]

# Table 8: Signature-Only Storage Growth Projections
STORAGE_GROWTH_PROJECTIONS = [
    {
        "configuration": "ECDSA",
        "bytes_per_tx": 70,
        "ten_k_tx": "0.70 MB",
        "one_million_tx": "70 MB",
        "one_billion_tx": "70 GB"
    },
    {
        "configuration": "ML-DSA-65",
        "bytes_per_tx": 3309,
        "ten_k_tx": "33.09 MB",
        "one_million_tx": "3.309 GB",
        "one_billion_tx": "3.309 TB"
    },
    {
        "configuration": "Proposed Hybrid",
        "bytes_per_tx": 3380,
        "ten_k_tx": "33.80 MB",
        "one_million_tx": "3.380 GB",
        "one_billion_tx": "3.380 TB"
    }
]

