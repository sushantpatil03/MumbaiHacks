from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from app.utils.logger import setup_logger

load_dotenv()

logger = setup_logger("main")

app = FastAPI(title="TaxNova Agentic CA")

@app.on_event("startup")
async def startup_event():
    logger.info("Starting TaxNova Backend...")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.endpoints import router as api_router

app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "TaxNova API is running"}
