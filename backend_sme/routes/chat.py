from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional, List
import shutil
import os
import uuid
from backend_sme.agents.deduction_agent import run_deduction_agent
from backend_sme.agents.gst_agent import run_gst_agent
from pydantic import BaseModel

router = APIRouter()

UPLOAD_DIR = "data/uploads/chat"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# In-memory session storage for MVP
sessions = {}

class ChatResponse(BaseModel):
    message: str
    savings_update: Optional[dict] = None

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(
    message: str = Form(...),
    files: List[UploadFile] = File(None),
    session_id: str = Form(...)
):
    # Initialize session if not exists
    if session_id not in sessions:
        sessions[session_id] = {
            "history": [],
            "uploaded_files": [],
            "savings": {"missedDeductions": 0, "gstItcMissed": 0, "details": []}
        }
    
    session = sessions[session_id]
    
    # Handle File Uploads
    file_contents = ""
    file_preview = ""
    if files:
        for file in files:
            file_path = os.path.join(UPLOAD_DIR, f"{session_id}_{file.filename}")
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            session["uploaded_files"].append(file_path)
            
            # Read content for analysis (simple text/csv for MVP)
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                    file_contents += f"\n--- File: {file.filename} ---\n{content}\n"
                    # Keep preview short for orchestrator
                    file_preview += f"\n--- File: {file.filename} ---\n{content[:500]}...\n"
            except Exception as e:
                print(f"Error reading file {file.filename}: {e}")

    # Add user message to history
    session["history"].append({
        "role": "user",
        "content": message
    })
    
    # Debug logging
    print(f"[DEBUG] Session ID: {session_id}")
    print(f"[DEBUG] Chat History Length: {len(session['history'])}")
    print(f"[DEBUG] Chat History: {session['history']}")
    
    # Run Orchestrator with chat history
    from backend_sme.agents.orchestrator import run_orchestrator_agent
    
    orchestrator_result = run_orchestrator_agent(message, file_preview if file_preview else "No files uploaded.", session["history"])
    intent = orchestrator_result.intent
    print(f"Orchestrator Intent: {intent}")

    response_text = "I've received your message."
    savings_update = None
    
    combined_input = f"{message}\n{file_contents}"
    
    if intent == "DEDUCTION_ANALYSIS":
        response_text = "I'm analyzing your documents for missed deductions..."
        try:
            # Run Deduction Agent with chat history
            result = run_deduction_agent(combined_input, session["history"])
            
            # Update Session Savings
            new_deductions = result.estimated_tax_saved
            session["savings"]["missedDeductions"] += new_deductions
            
            # Add details
            for deduction in result.deductions:
                session["savings"]["details"].append({
                    "category": deduction.section, # Fixed: Mapped section to category
                    "description": deduction.title, # Fixed: Mapped title to description
                    "amount": deduction.amount
                })
                
            response_text = f"I found potential deductions worth ₹{new_deductions}. {result.deductions[0].title if result.deductions else ''}"
            savings_update = session["savings"]
            
        except Exception as e:
            response_text = f"I encountered an error analyzing deductions: {str(e)}"

    elif intent == "GST_MATCHING":
        response_text = "I'm matching your GST documents..."
        try:
            # For GST, we ideally need 2 files. We'll pass what we have.
            result = run_gst_agent(combined_input, session["history"]) 
            
            new_itc = result.total_itc_missed
            session["savings"]["gstItcMissed"] += new_itc
             # Add details
            for item in result.missing_itc:
                session["savings"]["details"].append({
                    "category": "GST ITC Missed",
                    "description": f"Invoice {item.invoice_no} from {item.gstin}", # Fixed attribute names if needed, assume schema is correct
                    "amount": item.amount
                })

            response_text = f"I found missed ITC worth ₹{new_itc}. {len(result.missing_itc)} invoices matched."
            savings_update = session["savings"]
            
        except Exception as e:
             response_text = f"I encountered an error matching GST: {str(e)}"
    
    else:
        # GENERAL_QUERY
        if file_contents:
             response_text = f"I see you uploaded files. Based on my analysis, they don't look like standard financial documents I can process immediately. {orchestrator_result.reason}"
        else:
             response_text = "I can help you with Tax Deductions and GST Matching. Please upload your bank statements or GSTR files."

    # Add assistant response to history
    session["history"].append({
        "role": "assistant",
        "content": response_text
    })

    return ChatResponse(message=response_text, savings_update=savings_update)
