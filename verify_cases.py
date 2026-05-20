import requests
import time
import json

API_BASE = "http://localhost:8000/api"

CASES = [
    {
        "id": "1",
        "name": "Urban Flooding",
        "signals": [
            {"source": "Citizen", "text": "Water levels rising quickly in F-6 Markaz!", "location": "F-6 Markaz"},
            {"source": "Citizen", "text": "Basements flooded. Need help.", "location": "F-6 Markaz"}
        ],
        "expected_crisis": "Urban Flooding"
    },
    {
        "id": "2",
        "name": "Structural Fire",
        "signals": [
            {"source": "Citizen", "text": "Huge fire at the commercial building in Blue Area!", "location": "Blue Area"},
            {"source": "Citizen", "text": "Thick black smoke visible. Explosion heard.", "location": "Blue Area"}
        ],
        "expected_crisis": "Structural Fire"
    },
    {
        "id": "3",
        "name": "Traffic Accident",
        "signals": [
            {"source": "Citizen", "text": "Multi-car pileup on the expressway near Saddar.", "location": "Saddar"},
            {"source": "Traffic Cam", "text": "Accident detected. Lanes blocked.", "location": "Saddar"}
        ],
        "expected_crisis": "Major Traffic Incident"
    }
]

def verify():
    results = []
    for case in CASES:
        print(f"\nTesting {case['name']}...")
        
        # Reset
        requests.post(f"{API_BASE}/reset")
        
        # Send Signals
        requests.post(f"{API_BASE}/signals", json=case['signals'])
        
        # Analyze
        requests.post(f"{API_BASE}/analyze")
        
        # Wait for agents to work (as specified in antigravity.py sleeps)
        print("Waiting for agents to process (approx 6 seconds)...")
        time.sleep(7)
        
        # Check Result
        res = requests.get(f"{API_BASE}/crisis").json()
        actual_crisis = res.get("crisis_type", "None")
        
        actions_res = requests.get(f"{API_BASE}/actions").json()
        actions_count = len(actions_res.get("actions", []))
        
        success = actual_crisis == case['expected_crisis'] and actions_count > 0
        results.append({
            "case": case['name'],
            "expected": case['expected_crisis'],
            "actual": actual_crisis,
            "actions": actions_count,
            "status": "PASS" if success else "FAIL"
        })
        
        print(f"Result: {actual_crisis} ({actions_count} actions) -> {'PASS' if success else 'FAIL'}")

    print("\n" + "="*30)
    print("FINAL TEST REPORT")
    print("="*30)
    for r in results:
        print(f"{r['case']}: {r['status']} (Actual: {r['actual']})")

if __name__ == "__main__":
    verify()
