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
    required_amount: int
    estimated_tax_savings: int
    evidence: List[str]
    feasibility: str
    category: str

class UserProfile(BaseModel):
    job_id: str
    city: str = "Metro" # Default to Metro
    rent_annually: Optional[int] = None
    has_home_loan: bool = False
    investments_80c: int = 0
    health_premium: int = 0
    parsed_payroll: Optional[ParsedPayroll] = None
    chat_history: List[Dict[str, str]] = []
    
    # Phase 11: Dynamic Knowledge Base & Flow Status
    financial_knowledge_base: Dict[str, Any] = {}
    status: str = "interview" # interview, analyzing, report
    
    # Store analysis results in profile to avoid re-calculation
    observations: List[Dict] = []
    recommendations: List[Recommendation] = []
