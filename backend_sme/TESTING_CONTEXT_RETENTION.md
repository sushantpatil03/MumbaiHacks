# Testing Chat Context Retention - Quick Guide

## Important: Server Restart Required!

⚠️ **You MUST restart your backend server for the changes to take effect.**

The code has been updated but if your server is running with auto-reload, sometimes
Python's import cache can prevent new changes from loading properly.

## Steps to Test:

### 1. Restart the Backend Server

```bash
# Stop the current server (Ctrl+C if running)
cd /Users/yugbhanushali03/Desktop/development/mumbai-hacks-final/backend_sme

# Activate virtual environment (if needed)
source venv/bin/activate

# Start the server fresh
python main.py
# OR
python3 main.py
# OR
venv/bin/python3 main.py
```

### 2. Test the Context Retention

Open your frontend and have a conversation like this:

**Message 1:**
```
I want to find tax deductions in my expenses
```

**Expected Response:** Something about deductions

**Message 2:**  
```
Can you also check my GST invoices?
```

**Expected Behavior:** The AI should understand that "also" means in addition to the 
previous deduction request. It should maintain context.

**Message 3:**
```
Tell me more about the deductions you mentioned
```

**Expected Behavior:** The AI should reference the deductions from the first message.

### 3. Check Server Logs

Watch your server console output. You should see debug messages like:

```
[DEBUG] Session ID: abc123
[DEBUG] Chat History Length: 3
[DEBUG] Chat History: [{'role': 'user', 'content': 'I want to find tax deductions'}, ...]
[ORCHESTRATOR DEBUG] Received history length: 3
[ORCHESTRATOR DEBUG] Formatted history text: User: I want to find tax deductions...
```

### 4. What to Look For

✅ **Working Context:**
- Session ID remains the same across messages
- Chat History Length increases with each message (1, 3, 5, 7...)
- Formatted history text shows previous messages
- AI responses reference previous conversation

❌ **Not Working:**
- Chat History Length is always 1
- Session ID changes between messages  
- AI treats each message as a new conversation

## Troubleshooting

### If context still doesn't work:

1. **Check that session_id is consistent**
   - Look at the debug logs for `[DEBUG] Session ID:`
   - It should be the same value across all messages in a conversation

2. **Verify history is growing**
   - `[DEBUG] Chat History Length:` should increase (1, 3, 5, 7...)
   - If it's always 1, there's an issue

3. **Clear browser cache**
   - Sometimes the frontend might cache the old code
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

4. **Check server is using updated code**
   - Look for the debug log messages
   - If you don't see them, the server is running old code

5. **Kill all Python processes and restart**
   ```bash
   # Find Python processes
   ps aux | grep python
   
   # Kill the backend process
   kill <process_id>
   
   # Restart fresh
   python3 main.py
   ```

## What Was Fixed

1. ✅ Chat history is now stored in session memory
2. ✅ Each user message is added to history before processing  
3. ✅ Each AI response is added to history after processing
4. ✅ History is passed to all agents (orchestrator, deduction, GST)
5. ✅ Prompt templates include chat history context
6. ✅ Debug logging added to track the flow

## Files Modified

- `backend_sme/routes/chat.py` - Main chat endpoint with history storage
- `backend_sme/agents/orchestrator.py` - Orchestrator agent (routing)
- `backend_sme/agents/deduction_agent.py` - Deduction analysis agent
- `backend_sme/agents/gst_agent.py` - GST matching agent
- `backend_sme/prompts/orchestrator_prompt.txt` - Orchestrator prompt
- `backend_sme/prompts/deduction_prompt.txt` - Deduction prompt
- `backend_sme/prompts/gst_prompt.txt` - GST prompt

---

## Need Help?

If it's still not working after restarting, share:
1. The server console output (with the debug messages)
2. What messages you sent
3. What responses you received
