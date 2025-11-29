import json
from backend_sme.utils.openrouter_llm import call_llm
from backend_sme.models.schemas import GSTMatcherResponse
import os

def run_gst_agent(gstr2b_content: str, purchase_register_content: str) -> GSTMatcherResponse:
    # Load prompt template
    prompt_path = os.path.join(os.path.dirname(__file__), "../prompts/gst_prompt.txt")
    with open(prompt_path, "r") as f:
        template = f.read()

    # Inject data
    prompt = template.replace("{{gstr2b}}", gstr2b_content).replace("{{purchase_register}}", purchase_register_content)

    # Call LLM
    response_str = call_llm(prompt)

    # Parse JSON response
    cleaned_response = response_str.replace("```json", "").replace("```", "").strip()
    
    try:
        data = json.loads(cleaned_response)
        return GSTMatcherResponse(**data)
    except json.JSONDecodeError:
        print(f"Failed to parse LLM response: {response_str}")
        return GSTMatcherResponse(missing_itc=[], total_itc_missed=0)
