import sys
import os
import asyncio
from unittest.mock import MagicMock, patch
from fastapi import UploadFile

# Add project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from backend_sme.routes.chat import chat_endpoint, sessions
from backend_sme.models.schemas import DeductionResponse, DeductionItem, GSTMatcherResponse, MissingITCItem
from backend_sme.agents.orchestrator import OrchestratorResponse

async def test_deduction_flow():
    print("Testing Deduction Flow...")
    
    # Mock dependencies
    with patch("backend_sme.routes.chat.run_orchestrator_agent") as mock_orch, \
         patch("backend_sme.routes.chat.run_deduction_agent") as mock_deduction:
        
        # Setup mocks
        mock_orch.return_value = OrchestratorResponse(intent="DEDUCTION_ANALYSIS", reason="Test")
        
        mock_deduction.return_value = DeductionResponse(
            deductions=[
                DeductionItem(title="Office Rent", amount=10000.0, section="80GG", reason="Rent")
            ],
            estimated_tax_saved=3000.0
        )
        
        # Call endpoint
        session_id = "test_session_1"
        response = await chat_endpoint(
            message="Here is my bank statement",
            files=[],
            session_id=session_id
        )
        
        # Verify response
        print(f"Response: {response.message}")
        assert "worth ₹3000.0" in response.message
        
        # Verify session update (and that no AttributeError occurred)
        details = sessions[session_id]["savings"]["details"]
        print(f"Session Details: {details}")
        assert len(details) == 1
        assert details[0]["category"] == "80GG"
        assert details[0]["description"] == "Office Rent"
        print("Deduction Flow Passed!")

async def test_gst_flow():
    print("\nTesting GST Flow...")
    
    with patch("backend_sme.routes.chat.run_orchestrator_agent") as mock_orch, \
         patch("backend_sme.routes.chat.run_gst_agent") as mock_gst:
        
        mock_orch.return_value = OrchestratorResponse(intent="GST_MATCHING", reason="Test")
        
        mock_gst.return_value = GSTMatcherResponse(
            missing_itc=[
                MissingITCItem(invoice_no="INV-001", gstin="27AAAAA0000A1Z5", amount=500.0, reason="Missed")
            ],
            total_itc_missed=500.0
        )
        
        session_id = "test_session_2"
        response = await chat_endpoint(
            message="Check my GST",
            files=[],
            session_id=session_id
        )
        
        print(f"Response: {response.message}")
        assert "worth ₹500.0" in response.message
        
        details = sessions[session_id]["savings"]["details"]
        print(f"Session Details: {details}")
        assert len(details) == 1
        assert details[0]["category"] == "GST ITC Missed"
        assert "INV-001" in details[0]["description"]
        print("GST Flow Passed!")

if __name__ == "__main__":
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(test_deduction_flow())
    loop.run_until_complete(test_gst_flow())
