from pydantic import BaseModel
from typing import Dict, List, Optional, Any

class ParsedPayroll(BaseModel):
    gross_salary: int
    basic_salary: int
    hra_received: int
    pf: int
    allowances: Dict[str, int]

class Recommendation(BaseModel):
    id: str
    title: str
    description: str
    category: str  # "80C", "80D", "HRA", "Regime", "Other"
    potential_savings: float
    action_type: str  # "invest", "upload", "declare"

class LoopholeStrategy(BaseModel):
    title: str
    description: str
    impact: str
    complexity: str
    legal_status: str
    detailed_explanation: str

class UserProfile(BaseModel):
    job_id: str
    parsed_payroll: Optional[ParsedPayroll] = None
    chat_history: List[Dict[str, str]] = []
    
    # Financial Details (extracted or asked)
    city: str = "Metro" # Default to Metro
    rent_annually: Optional[int] = None
    has_home_loan: bool = False
    investments_80c: int = 0
    health_premium: int = 0
    
    # Phase 11: Dynamic Knowledge Base & Flow Status
    financial_knowledge_base: Dict[str, Any] = {}
    status: str = "interview" # interview, analyzing, report
    
    # Analysis Results
    observations: List[Dict] = []
    recommendations: List[Recommendation] = []
    loopholes: List[LoopholeStrategy] = []
