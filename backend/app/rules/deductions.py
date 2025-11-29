from typing import Dict, Tuple

def calc_hra_exempt(basic: int, hra_received: int, rent_paid: int, city_type: str) -> int:
    if rent_paid <= 0:
        return 0
    
    # HRA Exemption Rules:
    # 1. Actual HRA received
    # 2. Rent paid - 10% of basic
    # 3. 50% of basic (metro) or 40% (non-metro)
    
    rule1 = hra_received
    rule2 = max(0, rent_paid - (0.10 * basic))
    rule3 = (0.50 * basic) if city_type.lower() == "metro" else (0.40 * basic)
    
    return int(min(rule1, rule2, rule3))

def calc_80c_current(pf: int, investments: int) -> int:
    return min(150000, pf + investments)

def estimate_tax(taxable_income: int, regime: str = "new") -> int:
    # Simplified tax slabs for 2024-25
    tax = 0
    income = taxable_income
    
    if regime == "new":
        # New Regime Slabs (FY 24-25)
        # 0-3L: Nil
        # 3-7L: 5%
        # 7-10L: 10%
        # 10-12L: 15%
        # 12-15L: 20%
        # >15L: 30%
        
        # Standard deduction is now available in new regime too (50k) - handled outside or assumed included in taxable logic
        # For this function, we assume taxable_income is AFTER std deduction
        
        if income <= 300000:
            return 0
            
        # Rebate u/s 87A if income <= 7L
        if income <= 700000:
            return 0
            
        slabs = [
            (300000, 0),
            (700000, 0.05),
            (1000000, 0.10),
            (1200000, 0.15),
            (1500000, 0.20),
            (float('inf'), 0.30)
        ]
        
        previous_limit = 300000
        for limit, rate in slabs:
            if income > limit:
                tax += (limit - previous_limit) * rate
                previous_limit = limit
            else:
                tax += (income - previous_limit) * rate
                break
                
    else:
        # Old Regime (Simplified)
        # 0-2.5L: Nil
        # 2.5-5L: 5%
        # 5-10L: 20%
        # >10L: 30%
        
        if income <= 250000:
            return 0
        
        if income <= 500000:
            # Rebate 87A
            return 0
            
        slabs = [
            (250000, 0),
            (500000, 0.05),
            (1000000, 0.20),
            (float('inf'), 0.30)
        ]
        
        previous_limit = 250000
        for limit, rate in slabs:
            if income > limit:
                tax += (limit - previous_limit) * rate
                previous_limit = limit
            else:
                tax += (income - previous_limit) * rate
                break
                
    # Cess 4%
    return int(tax * 1.04)

def analyze_tax_situation(profile) -> Dict:
    # Extract values
    basic = profile.parsed_payroll.basic_salary
    hra_received = profile.parsed_payroll.hra_received
    pf = profile.parsed_payroll.pf
    gross = profile.parsed_payroll.gross_salary
    
    rent = profile.rent_annually or 0
    investments_80c = profile.investments_80c
    health = profile.health_premium
    
    # Calculations
    hra_exempt = calc_hra_exempt(basic, hra_received, rent, profile.city)
    util_80c = calc_80c_current(pf, investments_80c)
    std_deduction = 50000
    
    # Old Regime Taxable
    # Gross - HRA - Std Ded - 80C - 80D - PT(2400)
    taxable_old = gross - hra_exempt - std_deduction - util_80c - health - 2400
    tax_old = estimate_tax(max(0, taxable_old), "old")
    
    # New Regime Taxable
    # Gross - Std Ded
    # (New regime allows very few deductions, mainly Std Ded)
    taxable_new = gross - std_deduction
    tax_new = estimate_tax(max(0, taxable_new), "new")
    
    return {
        "tax_old": tax_old,
        "tax_new": tax_new,
        "hra_exempt": hra_exempt,
        "util_80c": util_80c,
        "gap_80c": 150000 - util_80c,
        "gap_80d": 25000 - health # Assuming self < 60
    }
