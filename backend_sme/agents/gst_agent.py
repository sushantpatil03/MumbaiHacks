import json
import os
from backend_sme.utils.openrouter_llm import call_llm
from backend_sme.models.schemas import GSTMatcherResponse

def run_gst_agent(file_content: str, chat_history: list = None) -> GSTMatcherResponse:
    # Load prompt template
    prompt_path = os.path.join(os.path.dirname(__file__), "../prompts/gst_prompt.txt")
    with open(prompt_path, "r") as f:
        template = f.read()

    # Format chat history for context
    history_text = ""
    if chat_history and len(chat_history) > 1:
        for msg in chat_history[:-1]:  # Exclude current message
            role = "User" if msg["role"] == "user" else "Assistant"
            history_text += f"{role}: {msg['content']}\n"

    # Inject data
    prompt = template.replace("{{parsed_data}}", file_content).replace("{{chat_history}}", history_text if history_text else "No previous conversation.")

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

