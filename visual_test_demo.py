import time
import requests

API_BASE = "http://127.0.0.1:8000/api"

scenarios = [
    {
        "name": "Urban Flooding in Blue Area",
        "signals": [
            {"source": "social_media", "text": "Water levels rising fast in Blue Area", "location": "Blue Area"},
            {"source": "weather_api", "text": "Heavy rainfall alert: 40mm in Blue Area", "location": "Blue Area"},
        ]
    },
    {
        "name": "Structural Fire in F-6 Markaz",
        "signals": [
            {"source": "social_media", "text": "Huge smoke coming from plaza in F-6 Markaz", "location": "F-6 Markaz"},
            {"source": "social_media", "text": "Fire alarms ringing at F-6 Markaz", "location": "F-6 Markaz"},
        ]
    },
    {
        "name": "Major Traffic Incident at Saddar",
        "signals": [
            {"source": "traffic_sensors", "text": "Multiple cars collided near Saddar", "location": "Saddar"},
            {"source": "social_media", "text": "Traffic completely jammed at Saddar", "location": "Saddar"},
        ]
    }
]

def run_visual_demo():
    print("Starting Visual Test Demo. Watch your browser tabs!")
    time.sleep(2)

    for i, case in enumerate(scenarios, 1):
        print(f"\n--- Running Scenario {i}: {case['name']} ---")
        
        # 1. Reset
        print("[*] Flushing Memory Registers (Reset)...")
        requests.post(f"{API_BASE}/reset")
        time.sleep(3) # Let user see reset

        # 2. Inject Signals
        print("[*] Injecting Signals...")
        for sig in case['signals']:
            requests.post(f"{API_BASE}/signals", json=[sig])
            time.sleep(2) # Inject one by one so UI updates

        # 3. Analyze
        print("[*] Executing Swarm Reasoning (Analysis)...")
        requests.post(f"{API_BASE}/analyze")
        
        # 4. Wait for analysis to finish and user to see the result
        print("[*] Waiting 10 seconds for you to observe the Threat Intelligence and Map...")
        time.sleep(12)

    print("\n✅ Visual Demo Finished!")
    print("Flushing state one last time...")
    requests.post(f"{API_BASE}/reset")

if __name__ == "__main__":
    run_visual_demo()
