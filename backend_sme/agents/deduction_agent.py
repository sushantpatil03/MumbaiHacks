import json
from backend_sme.utils.openrouter_llm import call_llm
from backend_sme.models.schemas import DeductionResponse
import os

def run_deduction_agent(file_content: str) -> DeductionResponse:
    # Load prompt template
    prompt_path = os.path.join(os.path.dirname(__file__), "../prompts/deduction_prompt.txt")
    with open(prompt_path, "r") as f:
        template = f.read()

    # Inject data
    prompt = template.replace("{{parsed_data}}", file_content)

    # Call LLM
    response_str = call_llm(prompt)

    # Parse JSON response
    # Basic cleanup to handle potential markdown code blocks from LLM
    cleaned_response = response_str.replace("```json", "").replace("```", "").strip()
    
    try:
        data = json.loads(cleaned_response)
        return DeductionResponse(**data)
    except json.JSONDecodeError:
        # Fallback or error handling
        print(f"Failed to parse LLM response: {response_str}")
        return DeductionResponse(deductions=[], estimated_tax_saved=0)
