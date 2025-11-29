from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.models.schemas import UserProfile
import os
import json

# Initialize LLM (GPT-4o for high quality formatting)
llm = ChatOpenAI(
    model="gpt-4o",
    openai_api_key=os.getenv("OPENAI_API_KEY"),
    temperature=0.3
)

REPORT_SYSTEM_PROMPT = """You are the "Reporter Agent" for TaxNova. 
Your goal is to generate a comprehensive, professional, and visually appealing HTML report for the user's tax consultation.

**Input Data:**
- User Profile (Name, Financials)
- Chat History (Key context)
- Observations (AI Findings)
- Recommendations (Actionable steps)
- Loopholes (Insider strategies)

**Output Format:**
Return ONLY valid HTML code. 
- Use Tailwind-like inline styles or a <style> block for a clean, modern, professional look (blue/gray theme).
- Include a Header with "TaxNova Confidential".
- Sections:
  1. **Executive Summary**: A personalized note based on the chat history.
  2. **Financial Snapshot**: A table of their income/investments.
  3. **AI Observations**: Bullet points of what was found.
  4. **Strategic Recommendations**: Actionable table (Action, Potential Savings).
  5. **Insider Vault (Loopholes)**: A special section for the "Loophole" strategies found. Mark this as "Restricted / High Value".
  6. **Disclaimer**: Standard AI disclaimer.

**Design Requirements:**
- Clean typography (sans-serif).
- Use cards or borders for sections.
- Highlight savings numbers in Green.
- Make it look like a premium consulting report.
"""

prompt = ChatPromptTemplate.from_messages([
    ("system", REPORT_SYSTEM_PROMPT),
    ("user", "Generate the tax report for this profile: {profile_json}")
])

chain = prompt | llm | StrOutputParser()

def generate_report_html(profile: UserProfile) -> str:
    try:
        # Serialize profile to JSON for the LLM
        # We exclude raw parsed payroll to save tokens if needed, but it's useful context
        profile_data = profile.dict()
        
        # Simplify chat history for the prompt (last 10 messages)
        profile_data['chat_history'] = profile_data['chat_history'][-10:]
        
        json_str = json.dumps(profile_data, default=str)
        
        html_content = chain.invoke({"profile_json": json_str})
        
        # Clean up markdown code blocks if present
        html_content = html_content.replace("```html", "").replace("```", "")
        
        return html_content
    except Exception as e:
        print(f"Error generating report HTML: {e}")
        return "<html><body><h1>Error generating report</h1></body></html>"
