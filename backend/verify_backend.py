import requests
import json
import time

BASE_URL = "http://localhost:8000"

def run_verification():
    print("Starting Backend Verification...")
    
    # 1. Upload (Use Sample)
    print("\n1. Testing Upload (Sample)...")
    response = requests.post(f"{BASE_URL}/api/upload", data={"use_sample": True, "sample_name": "sample_salary_rajesh"})
    if response.status_code != 200:
        print(f"FAILED: {response.text}")
        return
    data = response.json()
    job_id = data["job_id"]
    print(f"SUCCESS: Job ID {job_id} created.")
    
    # 2. Chat
    print("\n2. Testing Chat...")
    # Simulate answering rent question
    chat_payload = {"job_id": job_id, "user_message": "I pay 20000 rent per month"}
    response = requests.post(f"{BASE_URL}/api/chat", json=chat_payload)
    print(f"Agent Reply: {response.json()['agent_reply']}")
    
    # Simulate answering 80C question
    chat_payload = {"job_id": job_id, "user_message": "I have invested 50000 in PPF"}
    response = requests.post(f"{BASE_URL}/api/chat", json=chat_payload)
    print(f"Agent Reply: {response.json()['agent_reply']}")
    
    # 3. Observations
    print("\n3. Testing Observations...")
    response = requests.get(f"{BASE_URL}/api/observations/{job_id}")
    obs_data = response.json()
    print(f"Observations: {len(obs_data['observations'])}")
    print(f"Recommendations: {len(obs_data['recommendations'])}")
    
    if not obs_data['recommendations']:
        print("WARNING: No recommendations found.")
        return

    rec_id = obs_data['recommendations'][0]['id']
    
    # 4. Apply Recommendations
    print("\n4. Testing Apply Recommendations...")
    apply_payload = {"recommendation_ids": [rec_id]}
    response = requests.post(f"{BASE_URL}/api/apply_recommendations/{job_id}", json=apply_payload)
    savings_data = response.json()
    print(f"Savings Calculated: {savings_data['savings']}")
    
    # 5. Agent Status
    print("\n5. Testing Agent Status...")
    response = requests.get(f"{BASE_URL}/api/agents/status/{job_id}")
    print(f"Status: {response.json()}")
    
    # 6. Download PDF
    print("\n6. Testing PDF Download...")
    response = requests.get(f"{BASE_URL}/api/download/plan/{job_id}")
    if response.status_code == 200 and response.headers['content-type'] == 'application/pdf':
        print("SUCCESS: PDF generated and received.")
    else:
        print(f"FAILED: {response.status_code} - {response.headers.get('content-type')}")

if __name__ == "__main__":
    # Wait for server to start if running in parallel (manual check required in real usage)
    try:
        run_verification()
    except Exception as e:
        print(f"Error: {e}")
        print("Make sure the backend server is running on port 8000")
