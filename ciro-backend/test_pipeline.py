import requests
import time

BASE_URL = "http://localhost:8000/api"

def run_demo():
    print("--- CIRO Demo: Urban Flooding in G-10 Islamabad ---")
    
    # 1. Add Signals
    signals = [
        {
            "source": "social_media",
            "text": "G-10 mein pani bhar gaya hai, gaariyan phans gayi hain",
            "timestamp": "2025-05-12T08:30:00",
            "location": "G-10, Islamabad"
        },
        {
            "source": "weather_api",
            "text": "Heavy rainfall alert issued for Islamabad — 80mm expected",
            "timestamp": "2025-05-12T08:00:00",
            "location": "Islamabad"
        }
    ]
    
    print("Step 1: Sending input signals...")
    response = requests.post(f"{BASE_URL}/signals", json=signals)
    print(f"Response: {response.json()}")
    
    # 2. Trigger Analysis
    print("\nStep 2: Triggering Antigravity Analysis Pipeline...")
    response = requests.post(f"{BASE_URL}/analyze")
    print(f"Response: {response.json()}")
    
    # 3. Poll for Crisis
    print("\nStep 3: Polling for Crisis Detection...")
    for _ in range(5):
        crisis = requests.get(f"{BASE_URL}/crisis").json()
        if crisis.get("crisis_type"):
            print(f"Crisis Detected: {crisis['crisis_type']} at {crisis['location']}")
            print(f"Confidence: {crisis['confidence']}%")
            print(f"Reasoning: {crisis['reasoning']}")
            break
        time.sleep(2)
    
    # 4. Check Actions
    print("\nStep 4: Checking Action Execution Log...")
    time.sleep(3)
    actions = requests.get(f"{BASE_URL}/actions").json()
    for action in actions['actions']:
        print(f"[{action['time']}] {action['action']}: {action['status']} - {action['detail']}")

if __name__ == "__main__":
    run_demo()
