from fastapi import APIRouter, UploadFile, File, HTTPException
from backend_sme.agents.deduction_agent import run_deduction_agent
from backend_sme.models.schemas import DeductionResponse
from backend_sme.utils.file_parser import parse_file_content
import shutil
import os

router = APIRouter()

UPLOAD_DIR = "data/uploads/deductions"
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

@router.post("/run", response_model=DeductionResponse)
async def run_deduction_analysis():
    # In a real app, we might pass specific file IDs. 
    # For MVP, we'll just read the most recent files or all files in the upload dir.
    # Let's read all text/csv files in the directory and concatenate them.
    
    combined_content = ""
    try:
        for filename in os.listdir(UPLOAD_DIR):
            file_path = os.path.join(UPLOAD_DIR, filename)
            if os.path.isfile(file_path):
                try:
                    content = parse_file_content(file_path)
                    combined_content += f"\n--- File: {filename} ---\n"
                    combined_content += content
                except Exception as e:
                    print(f"Skipping file {filename}: {e}")
        
        if not combined_content:
            return DeductionResponse(deductions=[], estimated_tax_saved=0)

        result = run_deduction_agent(combined_content)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
