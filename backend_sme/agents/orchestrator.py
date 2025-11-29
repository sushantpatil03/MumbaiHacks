import json
import os
from backend_sme.utils.openrouter_llm import call_llm
from pydantic import BaseModel

class OrchestratorResponse(BaseModel):
    intent: str
    reason: str

def run_orchestrator_agent(user_message: str, file_content_preview: str) -> OrchestratorResponse:
    # Load prompt template
    prompt_path = os.path.join(os.path.dirname(__file__), "../prompts/orchestrator_prompt.txt")
    with open(prompt_path, "r") as f:
        template = f.read()

    # Inject data
    prompt = template.replace("{{user_message}}", user_message).replace("{{file_preview}}", file_content_preview)

    # Call LLM
    response_str = call_llm(prompt)

    # Parse JSON response
    cleaned_response = response_str.replace("```json", "").replace("```", "").strip()
    
    try:
        data = json.loads(cleaned_response)
        return OrchestratorResponse(**data)
    except json.JSONDecodeError:
        print(f"Failed to parse Orchestrator LLM response: {response_str}")
        # Default fallback
        return OrchestratorResponse(intent="GENERAL_QUERY", reason="Failed to parse intent.")
