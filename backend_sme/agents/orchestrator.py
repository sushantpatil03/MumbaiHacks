import json
import os
from backend_sme.utils.openrouter_llm import call_llm
from pydantic import BaseModel

class OrchestratorResponse(BaseModel):
    intent: str
    reason: str

def run_orchestrator_agent(user_message: str, file_content_preview: str, chat_history: list = None) -> OrchestratorResponse:
    # Load prompt template
    prompt_path = os.path.join(os.path.dirname(__file__), "../prompts/orchestrator_prompt.txt")
    with open(prompt_path, "r") as f:
        template = f.read()

    # Format chat history for context
    history_text = ""
    if chat_history and len(chat_history) > 1:  # More than just current message
        # Exclude the last message (current user message) as it's already in user_message
        for msg in chat_history[:-1]:
            role = "User" if msg["role"] == "user" else "Assistant"
            history_text += f"{role}: {msg['content']}\n"
    
    # Debug logging
    print(f"[ORCHESTRATOR DEBUG] Received history length: {len(chat_history) if chat_history else 0}")
    print(f"[ORCHESTRATOR DEBUG] Formatted history text: {history_text[:200] if history_text else 'No previous conversation.'}")
    
    # Inject data
    prompt = template.replace("{{user_message}}", user_message).replace("{{file_preview}}", file_content_preview).replace("{{chat_history}}", history_text if history_text else "No previous conversation.")

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

