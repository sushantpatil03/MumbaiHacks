import sys
import os

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from backend_sme.main import app
    print("✅ Backend app initialized successfully.")
except Exception as e:
    print(f"❌ Failed to initialize backend app: {e}")
    sys.exit(1)

try:
    from backend_sme.utils.openrouter_llm import call_llm
    print("✅ OpenRouter helper imported successfully.")
except Exception as e:
    print(f"❌ Failed to import OpenRouter helper: {e}")
    sys.exit(1)

print("Verification complete.")
