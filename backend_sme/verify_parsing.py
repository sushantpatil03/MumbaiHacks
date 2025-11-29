import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

print("Starting verification script...")
import shutil
from fastapi.testclient import TestClient
from backend_sme.main import app

client = TestClient(app)

def setup_directories():
    os.makedirs("data/uploads/deductions", exist_ok=True)
    os.makedirs("data/uploads/gst", exist_ok=True)

def create_dummy_deduction_file():
    content = """
    INVOICE
    Date: 2023-10-01
    Item: Office Laptop
    Amount: 50000
    Vendor: Dell India
    
    INVOICE
    Date: 2023-10-05
    Item: Team Lunch
    Amount: 5000
    Vendor: Pizza Hut
    """
    with open("data/uploads/deductions/test_invoice.txt", "w") as f:
        f.write(content)

def create_dummy_gst_files():
    gstr2b = """
    GSTR-2B
    Invoice: INV-001, Vendor: ABC Corp, Amount: 10000, Tax: 1800
    Invoice: INV-002, Vendor: XYZ Ltd, Amount: 20000, Tax: 3600
    """
    
    purchase_reg = """
    Purchase Register
    Invoice: INV-001, Vendor: ABC Corp, Amount: 10000, Tax: 1800
    Invoice: INV-002, Vendor: XYZ Ltd, Amount: 20000, Tax: 3600
    Invoice: INV-003, Vendor: PQR Ent, Amount: 5000, Tax: 900
    """
    
    with open("data/uploads/gst/gstr2b.txt", "w") as f:
        f.write(gstr2b)
    with open("data/uploads/gst/purchase_reg.txt", "w") as f:
        f.write(purchase_reg)

def test_deduction_flow():
    print("Testing Deduction Flow...")
    create_dummy_deduction_file()
    
    # Simulate file upload (not strictly needed since we placed file directly, but good for completeness)
    # But the route reads from directory, so we are good.
    
    response = client.post("/sme/deductions/run")
    if response.status_code == 200:
        print("Success!")
        print(response.json())
    else:
        print(f"Failed: {response.status_code}")
        print(response.text)

def test_gst_flow():
    print("\nTesting GST Flow...")
    create_dummy_gst_files()
    
    response = client.post("/sme/gst/run")
    if response.status_code == 200:
        print("Success!")
        print(response.json())
    else:
        print(f"Failed: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    setup_directories()
    try:
        test_deduction_flow()
        test_gst_flow()
    except Exception as e:
        print(f"An error occurred: {e}")
