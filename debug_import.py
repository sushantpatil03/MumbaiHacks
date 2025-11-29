import sys
import os

# Add project root to path
sys.path.append(os.getcwd())

print("Attempting to import backend_sme.main...")
try:
    from backend_sme.main import app
    print("Successfully imported app")
except Exception as e:
    print(f"Failed to import: {e}")
