from pydantic import BaseModel
from typing import List, Optional

# Deduction Finder Schemas
class DeductionItem(BaseModel):
    title: str
    amount: float
    section: str
    reason: str

class DeductionResponse(BaseModel):
    deductions: List[DeductionItem]
    estimated_tax_saved: float

# GST Matcher Schemas
class MissingITCItem(BaseModel):
    invoice_no: str
    gstin: str
    amount: float
    reason: str

class GSTMatcherResponse(BaseModel):
    missing_itc: List[MissingITCItem]
    total_itc_missed: float
