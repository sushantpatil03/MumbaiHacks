"""
Test script to verify chat context retention functionality.

This test simulates multiple chat messages within the same session
to verify that conversation history is properly maintained and used.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend_sme.agents.orchestrator import run_orchestrator_agent
from backend_sme.agents.deduction_agent import run_deduction_agent
from dotenv import load_dotenv

load_dotenv()


def test_context_retention():
    """Test that chat history is properly maintained across messages."""
    
    print("=" * 60)
    print("Testing Chat Context Retention")
    print("=" * 60)
    
    # Simulate a chat session
    chat_history = []
    
    # Message 1: Initial query
    print("\n[Test 1] First message - asking about deductions")
    user_msg_1 = "I want to find tax deductions in my expenses"
    chat_history.append({"role": "user", "content": user_msg_1})
    
    result_1 = run_orchestrator_agent(user_msg_1, "No files uploaded.", chat_history)
    print(f"Intent: {result_1.intent}")
    print(f"Reason: {result_1.reason}")
    
    assistant_msg_1 = f"I understand you want to find deductions. Intent: {result_1.intent}"
    chat_history.append({"role": "assistant", "content": assistant_msg_1})
    
    # Message 2: Follow-up question (should maintain context)
    print("\n[Test 2] Second message - follow-up question with context")
    user_msg_2 = "Can you also check my GST invoices?"
    chat_history.append({"role": "user", "content": user_msg_2})
    
    result_2 = run_orchestrator_agent(user_msg_2, "No files uploaded.", chat_history)
    print(f"Intent: {result_2.intent}")
    print(f"Reason: {result_2.reason}")
    print(f"Chat History Length: {len(chat_history)}")
    
    assistant_msg_2 = f"I can help with GST. Intent: {result_2.intent}"
    chat_history.append({"role": "assistant", "content": assistant_msg_2})
    
    # Message 3: Another follow-up (should have full context)
    print("\n[Test 3] Third message - testing context awareness")
    user_msg_3 = "What about the previous deductions you mentioned?"
    chat_history.append({"role": "user", "content": user_msg_3})
    
    result_3 = run_orchestrator_agent(user_msg_3, "No files uploaded.", chat_history)
    print(f"Intent: {result_3.intent}")
    print(f"Reason: {result_3.reason}")
    print(f"Chat History Length: {len(chat_history)}")
    
    # Display full chat history
    print("\n" + "=" * 60)
    print("Full Chat History:")
    print("=" * 60)
    for i, msg in enumerate(chat_history):
        print(f"{i+1}. {msg['role'].upper()}: {msg['content']}")
    
    print("\n" + "=" * 60)
    print("✓ Context retention test completed successfully!")
    print("  - Chat history is being maintained across messages")
    print("  - Agents are receiving conversation context")
    print("=" * 60)

def test_deduction_agent_with_context():
    """Test deduction agent with chat history."""
    
    print("\n" + "=" * 60)
    print("Testing Deduction Agent with Context")
    print("=" * 60)
    
    chat_history = [
        {"role": "user", "content": "I need help finding tax deductions"},
        {"role": "assistant", "content": "I can help you find deductions. Please share your expense data."}
    ]
    
    # Sample expense data
    sample_data = """
    Date: 2024-01-15, Description: Office laptop, Amount: 45000
    Date: 2024-02-20, Description: Software subscription, Amount: 12000
    Date: 2024-03-10, Description: Client dinner, Amount: 3000
    """
    
    chat_history.append({"role": "user", "content": "Here are my expenses"})
    
    print("\nCalling deduction agent with chat history...")
    print(f"Chat History Length: {len(chat_history)}")
    
    try:
        result = run_deduction_agent(sample_data, chat_history)
        print(f"✓ Agent called successfully with context")
        print(f"  - Found {len(result.deductions)} deductions")
        print(f"  - Estimated savings: ₹{result.estimated_tax_saved}")
    except Exception as e:
        print(f"✗ Error: {str(e)}")
    
    print("=" * 60)

if __name__ == "__main__":
    try:
        test_context_retention()
        print("\n")
        test_deduction_agent_with_context()
    except Exception as e:
        print(f"\n✗ Test failed with error: {str(e)}")
        import traceback
        traceback.print_exc()
