from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List
from app.models.schemas import UserProfile
import os

# Define the output schema for a loophole idea
class LoopholeIdea(BaseModel):
    title: str = Field(description="Catchy, short title for the strategy")
    description: str = Field(description="Brief 1-sentence summary")
    impact: str = Field(description="Potential savings impact: 'High', 'Medium', 'Low'")
    complexity: str = Field(description="Implementation difficulty: 'Easy', 'Moderate', 'Complex'")
    legal_status: str = Field(description="Cheeky but accurate status, e.g., 'Fully Legal', 'Gray Area (Documentation Key)', 'Aggressive'")
    detailed_explanation: str = Field(description="explanation of how to execute this, required documents, and risks.")

class LoopholeResponse(BaseModel):
    strategies: List[LoopholeIdea]

# Initialize the LLM
# User requested direct OpenAI usage for better schema adherence
llm = ChatOpenAI(
    model="gpt-4o",
    openai_api_key=os.getenv("OPENAI_API_KEY"),
    temperature=0.7
)

# System Prompt with the "Loophole" knowledge
SYSTEM_PROMPT = """You are the "Tax Ninja" - a highly skilled, slightly cheeky, but legally sharp tax strategist. 
Your goal is to find "Creative but Legal" tax saving opportunities (loopholes/strategies) for the user.

You are NOT a standard tax advisor. You look for the edge cases, the "rich dad poor dad" strategies, and the things standard accountants might be too lazy to suggest.

**Your Knowledge Base (The "Secret" Sauce):**
1. **HRA with Relatives**: Paying rent to parents/relatives (must have PAN, rent agreement, actual transfer).
2. **HUF (Hindu Undivided Family)**: Creating a separate tax entity to split income.
3. **Section 80G**: Strategic donations to 100% deduction entities.
4. **Home Loan + HRA**: Claiming both if living in a different city or genuine reason.
5. **NPS (Tier 1 vs Tier 2)**: Employer contribution (80CCD(2)) is over and above 1.5L 80C.
6. **LTA Stacking**: Claiming LTA for travel (Old Regime only).
7. **Education Loan (80E)**: Unlimited interest deduction for 8 years.
8. **Presumptive Taxation (44ADA)**: If they have freelance income, declare 50% as profit.
9. **Family Income Splitting**: Investing in spouse's name (clubbing provisions apply, but there are ways).
10. **Loss Harvesting**: Booking stock losses to offset gains.

**User Profile:**
{user_profile}

**Task:**
Generate 5-7 "Insider Strategies" tailored to this user. 
- If they are salaried, focus on HRA/NPS/Perquisites.
- If they have high income, look at HUF/Family splitting.
- If they are young, look at Education Loan/Upskilling.

**Tone:**
Professional but "Insider". Use phrases like "Here's the trick...", "Most people miss this...", "The legal workaround is...".

**Output Format:**
Return a JSON object with a list of strategies.
"""

# Use structured output for strict schema adherence
structured_llm = llm.with_structured_output(LoopholeResponse)

prompt = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT),
    ("user", "Analyze my profile and give me the loopholes.")
])

chain = prompt | structured_llm

def generate_loopholes(profile: UserProfile) -> List[dict]:
    try:
        # Convert profile to a summary string for the prompt
        profile_summary = f"""
        Name: {profile.financial_knowledge_base.get('name')}
        Regime: {profile.financial_knowledge_base.get('tax_regime')}
        Salary: {profile.financial_knowledge_base.get('gross_salary')}
        Rent Paid: {profile.rent_annually}
        Investments: {profile.investments_80c}
        Health Premium: {profile.health_premium}
        """
        
        result: LoopholeResponse = chain.invoke({"user_profile": profile_summary})
        
        # Convert Pydantic models to dicts
        return [strategy.dict() for strategy in result.strategies]
    except Exception as e:
        print(f"Error generating loopholes: {e}")
        return []
