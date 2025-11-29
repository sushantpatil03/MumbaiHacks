import requests
import os
import json

def call_llm(prompt: str):
    """
    Calls the OpenRouter API with the given prompt.
    Uses 'x-ai/grok-4.1-fast:free' model with reasoning enabled.
    """
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        print("Warning: OPENROUTER_API_KEY not found in environment variables.")
        raise ValueError("OPENROUTER_API_KEY is missing")

    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "TaxNova SME",
    }
    data = {
        "model": "x-ai/grok-4.1-fast:free",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "extra_body": {"reasoning": {"enabled": True}}
    }

    try:
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()
        result = response.json()
        # We return the content. The reasoning details are available in result['choices'][0]['message'].get('reasoning_details')
        # if we ever need them, but for now the agents expect just the content string.
        return result["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Error calling OpenRouter: {e}")
        return f"Error: {str(e)}"
