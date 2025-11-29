from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import time
from app.utils.logger import setup_logger

load_dotenv()

logger = setup_logger("main")

app = FastAPI(title="TaxNova Agentic CA")

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    # Log Request Details
    logger.info(f"➡️  INCOMING: {request.method} {request.url}")
    
    # Try to log body for JSON requests only (to avoid consuming streams for files)
    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        try:
            body = await request.body()
            logger.debug(f"📝 Body: {body.decode('utf-8')[:1000]}")
            # Re-seed the body for downstream
            async def receive():
                return {"type": "http.request", "body": body, "more_body": False}
            request._receive = receive
        except Exception as e:
            logger.warning(f"Could not log body: {e}")
            
    response = await call_next(request)
    
    process_time = (time.time() - start_time) * 1000
    logger.info(f"⬅️  RESPONSE: {response.status_code} | ⏱️  {process_time:.2f}ms")
    
    return response

@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Starting TaxNova Backend...")

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
