import sys
import os

# Add the project root directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend_sme.routes import deductions, gst_matcher
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="TaxNova SME MVP")

# CORS Setup
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routes
app.include_router(deductions.router, prefix="/sme/deductions", tags=["Deductions"])
app.include_router(gst_matcher.router, prefix="/sme/gst", tags=["GST Matcher"])
from backend_sme.routes import chat
app.include_router(chat.router, prefix="/sme/chat", tags=["Chat"])

@app.get("/")
def read_root():
    return {"message": "TaxNova SME MVP Backend is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend_sme.main:app", host="127.0.0.1", port=8000, reload=True)
