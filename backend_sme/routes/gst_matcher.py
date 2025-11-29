from fastapi import APIRouter, UploadFile, File, HTTPException
from backend_sme.agents.gst_agent import run_gst_agent
from backend_sme.models.schemas import GSTMatcherResponse
from backend_sme.utils.file_parser import parse_file_content
import shutil
import os

router = APIRouter()

UPLOAD_DIR = "data/uploads/gst"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_files(files: list[UploadFile] = File(...)):
    saved_files = []
    for file in files:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        saved_files.append(file.filename)
    return {"message": "Files uploaded successfully", "files": saved_files}

@router.post("/run", response_model=GSTMatcherResponse)
async def run_gst_matching():
    # For MVP, we'll assume files are named or we just take the first two text files found.
    # Or simpler: we concatenate all files and let the LLM figure it out (might be risky for token limits).
    # Better: Try to identify GSTR2B vs Purchase Register by filename or content.
    # For this hackathon MVP, let's just concatenate everything and label it "Input Documents".
    # But the prompt expects two separate inputs.
    
    gstr2b_content = ""
    purchase_register_content = ""
    
    try:
        files = os.listdir(UPLOAD_DIR)
        combined_content = ""
        
        for filename in files:
            file_path = os.path.join(UPLOAD_DIR, filename)
            if os.path.isfile(file_path):
                try:
                    content = parse_file_content(file_path)
                    combined_content += f"\n--- File: {filename} ---\n"
                    combined_content += content
                except Exception as e:
                    print(f"Skipping file {filename}: {e}")
        
        if not combined_content:
             return GSTMatcherResponse(missing_itc=[], total_itc_missed=0)

        result = run_gst_agent(combined_content)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
