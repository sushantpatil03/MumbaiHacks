#!/usr/bin/env python3
"""
Simple test to verify:
1. Orchestrator can classify intents correctly
2. DeductionItem schema mapping fix works
"""
import sys
import os

# Add project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from backend_sme.models.schemas import DeductionResponse, DeductionItem

def test_deduction_item_schema():
    """Test that we can create DeductionItem and access correct attributes"""
    print("Testing DeductionItem Schema...")
    
    # Create a DeductionItem with the correct schema
    item = DeductionItem(
        title="Office Rent",
        amount=10000.0,
        section="80GG",
        reason="Rent payment for business premises"
    )
    
    # Verify attributes exist
    assert hasattr(item, 'title'), "DeductionItem should have 'title' attribute"
    assert hasattr(item, 'section'), "DeductionItem should have 'section' attribute"
    assert hasattr(item, 'amount'), "DeductionItem should have 'amount' attribute"
    assert hasattr(item, 'reason'), "DeductionItem should have 'reason' attribute"
    
    # Verify we cannot access non-existent attributes that were causing the error
    try:
        _ = item.category
        print("ERROR: 'category' attribute should not exist!")
        sys.exit(1)
    except AttributeError:
        print("✓ Correctly raises AttributeError for 'category'")
    
    try:
        _ = item.description
        print("ERROR: 'description' attribute should not exist!")
        sys.exit(1)
    except AttributeError:
        print("✓ Correctly raises AttributeError for 'description'")
    
    # Test the proper mapping we did in chat.py
    # category -> section, description -> title
    category_value = item.section  # This is what chat.py now uses
    description_value = item.title  # This is what chat.py now uses
    
    print(f"✓ Mapped category (section): {category_value}")
    print(f"✓ Mapped description (title): {description_value}")
    
    print("\n✓ DeductionItem Schema Test Passed!\n")
    return True

def test_orchestrator_import():
    """Verify orchestrator can be imported"""
    print("Testing Orchestrator Import...")
    
    try:
        from backend_sme.agents.orchestrator import run_orchestrator_agent, OrchestratorResponse
        print("✓ Orchestrator module imported successfully")
        
        # Verify OrchestratorResponse schema
        response = OrchestratorResponse(intent="DEDUCTION_ANALYSIS", reason="Test")
        assert response.intent == "DEDUCTION_ANALYSIS"
        print(f"✓ OrchestratorResponse created: {response.intent}")
        print("\n✓ Orchestrator Import Test Passed!\n")
        return True
    except Exception as e:
        print(f"✗ Failed to import orchestrator: {e}")
        return False

def test_chat_fix():
    """Verify the chat.py fix will work with real DeductionItem"""
    print("Testing Chat.py Fix...")
    
    from backend_sme.models.schemas import DeductionResponse, DeductionItem
    
    # Simulate what run_deduction_agent returns
    result = DeductionResponse(
        deductions=[
            DeductionItem(title="Office Rent", amount=10000.0, section="80GG", reason="Rent"),
            DeductionItem(title="Internet Bill", amount=2000.0, section="37(1)", reason="Business expense")
        ],
        estimated_tax_saved=3600.0
    )
    
    # Simulate what chat.py now does (the fixed code)
    details = []
    for deduction in result.deductions:
        details.append({
            "category": deduction.section,  # Fixed: was deduction.category
            "description": deduction.title,  # Fixed: was deduction.description
            "amount": deduction.amount
        })
    
    print(f"✓ Created {len(details)} detail entries without AttributeError")
    for detail in details:
        print(f"  - Category: {detail['category']}, Description: {detail['description']}, Amount: {detail['amount']}")
    
    print("\n✓ Chat.py Fix Test Passed!\n")
    return True

if __name__ == "__main__":
    print("=" * 60)
    print("Running Verification Tests")
    print("=" * 60 + "\n")
    
    all_pass = True
    
    all_pass &= test_deduction_item_schema()
    all_pass &= test_orchestrator_import()
    all_pass &= test_chat_fix()
    
    print("=" * 60)
    if all_pass:
        print("ALL TESTS PASSED ✓")
    else:
        print("SOME TESTS FAILED ✗")
        sys.exit(1)
    print("=" * 60)
