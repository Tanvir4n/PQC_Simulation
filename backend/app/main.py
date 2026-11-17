"""
QuantumResist API Server
Main entrypoint for the Interactive Hybrid Classical-Post-Quantum Blockchain Simulation Platform.
Author: Md. Tanvir Hasan (Daffodil International University)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.data.paper_reference import PAPER_METADATA

# Import API Routers
from app.api.crypto_router import router as crypto_router
from app.api.blockchain_router import router as blockchain_router
from app.api.network_router import router as network_router
from app.api.migration_router import router as migration_router
from app.api.security_router import router as security_router
from app.api.scalability_router import router as scalability_router
from app.api.evm_router import router as evm_router
from app.api.ws_router import router as ws_router
from app.api.pipeline_router import router as pipeline_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all modules
app.include_router(crypto_router, prefix=settings.API_PREFIX)
app.include_router(blockchain_router, prefix=settings.API_PREFIX)
app.include_router(network_router, prefix=settings.API_PREFIX)
app.include_router(migration_router, prefix=settings.API_PREFIX)
app.include_router(security_router, prefix=settings.API_PREFIX)
app.include_router(scalability_router, prefix=settings.API_PREFIX)
app.include_router(evm_router, prefix=settings.API_PREFIX)
app.include_router(ws_router, prefix=settings.API_PREFIX)
app.include_router(pipeline_router, prefix=settings.API_PREFIX)


@app.get("/")
def root():
    return {
        "status": "online",
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "author": settings.AUTHOR,
        "affiliation": settings.AFFILIATION,
        "orcid": settings.ORCID,
        "docs_url": "/docs"
    }


@app.get("/health")
def healthcheck():
    return {"status": "healthy"}


@app.get("/api/paper-info")
def get_paper_metadata():
    return PAPER_METADATA

