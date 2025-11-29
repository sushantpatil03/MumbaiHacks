from typing import List, Dict, Tuple, Optional, Any
from app.models.schemas import UserProfile, Recommendation
from app.rules.deductions import analyze_tax_situation
import uuid
import os
import json
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from app.utils.logger import setup_logger

logger = setup_logger("agents")

# Phase 11: Switch to OpenRouter (Grok)
# We use the standard ChatOpenAI client but point it to OpenRouter
llm = ChatOpenAI(
    model="x-ai/grok-4.1-fast:free",
    openai_api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1", # Correct param for newer langchain versions
    temperature=0.1
)

class KnowledgeUpdate(BaseModel):
    """
    Structure for extracting dynamic financial knowledge.
    """
    extracted_info: Dict[str, Any] = Field(description="Key-value pairs of financial facts extracted from the user message. E.g., {'rent_amount': 150000, 'has_parents': True, 'interested_in_stocks': True}")
    user_intent: str = Field(description="The intent of the user message. E.g., 'provide_info', 'ask_question', 'agree_to_analysis', 'upload_file'")

class OrchestratorResponse(BaseModel):
    """
    Structure for the agent's decision and response.
    """
    thought_process: str = Field(description="Internal reasoning about what to do next.")
    reply_to_user: str = Field(description="The message to show to the user.")
    next_action: str = Field(description="The next system action: 'continue_interview', 'trigger_analysis', 'show_results'")

class OrchestratorAgent:
    def __init__(self):
        self.extractor_llm = llm.with_structured_output(KnowledgeUpdate)
        self.decider_llm = llm.with_structured_output(OrchestratorResponse)

    def process_message(self, profile: UserProfile, user_message: str) -> Tuple[str, UserProfile]:
        """
        Main orchestration loop:
        1. Extract Knowledge -> Update Knowledge Base
        2. Decide Action -> (Interview / Analyze / Report)
        3. Generate Response
        """
        logger.info(f"🤖 AGENT: Processing message from User: '{user_message}'")
        logger.debug(f"Current Profile Status: {profile.status}")
        
        # Fallback for empty message
        if not user_message:
            logger.warning("Received empty user message.")
            return "I didn't catch that. Could you please say it again?", profile

        knowledge_update = KnowledgeUpdate(extracted_info={}, user_intent="unknown")

        # --- Step 1: Dynamic Knowledge Extraction ---
        # Skip extraction for system start signal
        if user_message != "<START>":
            extraction_prompt = ChatPromptTemplate.from_messages([
                ("system", "You are an expert financial analyst. Extract ALL relevant financial details, preferences, and personal context from the user's message into a structured JSON dictionary. "
                           "Also determine the user's intent. "
                           "Current Knowledge Base: {kb} "
                           "Handle Indian numbering (lakhs, cr) by converting to integers."),
                ("user", "{message}")
            ])
            
            try:
                logger.debug("🧠 EXTRACTOR: Invoking LLM...")
                kb_json = json.dumps(profile.financial_knowledge_base, default=str)
                
                knowledge_update: KnowledgeUpdate = (extraction_prompt | self.extractor_llm).invoke({
                    "kb": kb_json,
                    "message": user_message
                })
                logger.info(f"📥 EXTRACTED: {knowledge_update.extracted_info}")
                logger.info(f"🎯 INTENT: {knowledge_update.user_intent}")
                
                # Update Knowledge Base
                profile.financial_knowledge_base.update(knowledge_update.extracted_info)
                
                # Sync specific legacy fields for backward compatibility with Rule Engine
                kb = profile.financial_knowledge_base
                if "rent_amount" in kb: profile.rent_annually = int(kb["rent_amount"])
                if "rent" in kb: profile.rent_annually = int(kb["rent"])
                if "80c_investments" in kb: profile.investments_80c = int(kb["80c_investments"])
                if "health_insurance" in kb: profile.health_premium = int(kb["health_insurance"])
                
            except Exception as e:
                logger.error(f"❌ Extraction Error: {e}", exc_info=True)
                # Continue execution even if extraction fails

        # --- Step 2: Decision & Response ---
        
        # Heuristic: Check if we have core info
        has_core_info = (profile.rent_annually is not None and 
                         profile.investments_80c is not None and 
                         profile.health_premium is not None)
        
        # Define the persona and rules
        # Define the persona and rules
        system_instruction = (
            "You are TaxNova, an intelligent Agentic CA. You are orchestrating a tax consultation. "
            f"Current Flow Status: {profile.status}. "
            f"User Intent: {knowledge_update.user_intent}. "
            f"Knowledge Base: {json.dumps(profile.financial_knowledge_base, default=str)}. "
            f"Missing Core Info: Rent ({profile.rent_annually}), 80C ({profile.investments_80c}), Health ({profile.health_premium}). "
            "\n\n"
            "GOAL: Gather financial info to optimize taxes. "
            "INTERVIEW SCRIPT:\n"
            "1. CHECK KNOWLEDGE BASE FIRST: If 'name' and 'tax_regime' are already present, SKIP the greeting and regime questions. "
            "   Instead, say: 'Hi {name}! I see you've selected the {tax_regime} regime. Let's analyze your savings.' and move to step 3.\n"
            "2. If name is UNKNOWN, ask: 'Hello! I'm TaxNova. May I know your name?'\n"
            "3. If name is known but Tax Regime is UNKNOWN, ask: 'Hi {name}, nice to meet you! To start, are you currently opting for the Old or New Tax Regime?'\n"
            "4. If Regime is known:\n"
            "   - If 'Old Regime': Ask for Rent, 80C (PF/PPF/ELSS), and Health Insurance to maximize deductions.\n"
            "   - If 'New Regime': Explain that while deductions are limited, you'd like to check if the Old Regime saves more money. Ask for Rent/Investments specifically for this COMPARISON.\n"
            "5. If all core info is gathered, SUMMARIZE the profile and ASK to start analysis.\n"
            "6. If user agrees to analysis, set next_action='trigger_analysis'.\n"
            "7. If status is 'report', explain the key observations briefly and ask if they want to deep dive.\n"
        )
        
        decision_prompt = ChatPromptTemplate.from_messages([
            ("system", "{system_instruction}"),
            ("user", "{message}")
        ])
        
        try:
            logger.debug("🧠 DECIDER: Invoking LLM...")
            # If <START>, we pass a dummy message to the LLM to trigger the greeting
            msg_to_llm = "Start the conversation." if user_message == "<START>" else user_message
            
            decision: OrchestratorResponse = (decision_prompt | self.decider_llm).invoke({
                "system_instruction": system_instruction,
                "message": msg_to_llm
            })
            logger.info(f"🤔 THOUGHT: {decision.thought_process}")
            logger.info(f"👉 ACTION: {decision.next_action}")
            logger.info(f"🗣️ REPLY: {decision.reply_to_user}")
            
            # Handle Actions
            if decision.next_action == "trigger_analysis":
                profile.status = "analyzing"
                logger.info("🚀 Triggering analysis mode based on agent decision.")
                # Trigger analysis immediately
                obs, recs = observation_agent.analyze(profile)
                profile.observations = obs
                profile.recommendations = recs
                profile.status = "report" # Move to report mode
                
                # Generate a summary message for the chat
                response_text = "I've completed the analysis! 📊\n\n" \
                                "I found some significant opportunities to save tax. " \
                                "You can see the detailed observations on the dashboard. " \
                                "Would you like me to explain the key findings?"
            else:
                response_text = decision.reply_to_user
            
        except Exception as e:
            logger.error(f"❌ Decision Error: {e}", exc_info=True)
            response_text = "I'm having trouble connecting to my brain right now. Could you please repeat that?"

        # Update history
        # If it was <START>, we record it as an empty user string so frontend can hide it
        recorded_user_msg = "" if user_message == "<START>" else user_message
        
        profile.chat_history.append({
            "user": recorded_user_msg,
            "agent": response_text
        })
        
        return response_text, profile

class TaxObservation(BaseModel):
    title: str
    description: str
    impact: str = Field(description="HIGH, MEDIUM, or LOW")

class TaxRecommendation(BaseModel):
    title: str
    description: str
    required_amount: int
    estimated_tax_savings: int
    feasibility: str
    category: str

class AnalysisOutput(BaseModel):
    observations: List[TaxObservation]
    recommendations: List[TaxRecommendation]

class ObservationAgent:
    def __init__(self):
        self.analyzer_llm = llm.with_structured_output(AnalysisOutput)

    def analyze(self, profile: UserProfile) -> Tuple[List[Dict], List[Recommendation]]:
        # Hybrid approach: Use rule engine for hard math, LLM for insights
        
        math_analysis = analyze_tax_situation(profile)
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an expert Tax Consultant. Analyze the user's financial profile and the calculated tax metrics. "
                       "Generate insightful observations and actionable recommendations to save tax. "
                       "Focus on Section 80C, 80D, HRA, and New vs Old regime. "
                       "Use the provided math analysis as the ground truth for numbers."),
            ("user", "Profile: {profile}\nMath Analysis: {math}\n\nGenerate observations and recommendations.")
        ])
        
        chain = prompt | self.analyzer_llm
        
        try:
            result: AnalysisOutput = chain.invoke({
                "profile": profile.dict(),
                "math": math_analysis
            })
            
            # Convert to internal schema
            observations = [obs.dict() for obs in result.observations]
            recommendations = []
            for rec in result.recommendations:
                recommendations.append(Recommendation(
                    id=str(uuid.uuid4()),
                    title=rec.title,
                    description=rec.description,
                    required_amount=rec.required_amount,
                    estimated_tax_savings=rec.estimated_tax_savings,
                    evidence=["Generated by AI"],
                    feasibility=rec.feasibility,
                    category=rec.category
                ))
                
            return observations, recommendations
            
        except Exception as e:
            print(f"Analysis Error: {e}")
            return [], []

# Initialize Agents
# Note: We use the OrchestratorAgent as the main 'interview_agent' for compatibility
interview_agent = OrchestratorAgent()
observation_agent = ObservationAgent()
