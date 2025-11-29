import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend_sme.agents.deduction_agent import run_deduction_agent
from backend_sme.agents.gst_agent import run_gst_agent
from dotenv import load_dotenv

load_dotenv()

def test_deduction_agent():
    print("Testing Deduction Agent...")
    content = """
    INVOICE
    Date: 2023-10-01
    Item: Office Laptop
    Amount: 50000
    Vendor: Dell India
    """
    try:
        result = run_deduction_agent(content)
        print("Deduction Result:", result)
    except Exception as e:
        print(f"Deduction Failed: {e}")

def test_gst_agent():
    print("\nTesting GST Agent...")
    content = """
    --- File: gstr2b.txt ---
    GSTR-2B
    Invoice: INV-001, Vendor: ABC Corp, Amount: 10000, Tax: 1800
    
    --- File: purchase_reg.txt ---
    Purchase Register
    Invoice: INV-001, Vendor: ABC Corp, Amount: 10000, Tax: 1800
    Invoice: INV-002, Vendor: XYZ Ltd, Amount: 20000, Tax: 3600
    """
    try:
        result = run_gst_agent(content)
        print("GST Result:", result)
    except Exception as e:
        print(f"GST Failed: {e}")

if __name__ == "__main__":
    test_deduction_agent()
    test_gst_agent()
