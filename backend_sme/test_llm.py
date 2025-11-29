import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend_sme.utils.openrouter_llm import call_llm
from dotenv import load_dotenv

load_dotenv()

print("Testing LLM connection...")
try:
    response = call_llm("Hello, are you there?")
    print(f"LLM Response: {response}")
except Exception as e:
    print(f"LLM Call Failed: {e}")
