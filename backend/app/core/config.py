import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
CONTRACTS_DIR = Path(__file__).resolve().parent.parent.parent.parent / "contracts"

class Settings:
    PROJECT_NAME: str = "QuantumResist API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Interactive Hybrid Blockchain Research Simulation & Visualization Platform"
    AUTHOR: str = "Md. Tanvir Hasan"
    AFFILIATION: str = "Department of Computer Science Engineering, Daffodil International University"
    ORCID: str = "0009-0008-9130-3360"
    
    API_PREFIX: str = "/api"
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "*"
    ]
    
    ANVIL_RPC_URL: str = os.getenv("ANVIL_RPC_URL", "http://127.0.0.1:8545")
    ANVIL_CHAIN_ID: int = 31337

settings = Settings()

