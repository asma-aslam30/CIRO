import requests
import time
import json

API_BASE = "http://localhost:8000/api"

CASES = [
    {
        "id": "1",
        "name": "Urban Flooding (High Severity)",
        "signals": [
            {"source": "Citizen", "text": "Water levels rising quickly in F-6 Markaz!", "location": "F-6 Markaz"},
            {"source": "Citizen", "text": "Basements flooded in several houses. Need help.", "location": "F-6 Markaz"},
            {"source": "Sensor", "text": "Heavy rain causing massive puddles on main roads.", "location": "F-6 Markaz"}
        ]
    },
    {
        "id": "2",
        "name": "Structural Fire (Critical Severity)",
        "signals": [
            {"source": "Citizen", "text": "Huge fire at the commercial building in Blue Area!", "location": "Blue Area"},
            {"source": "Citizen", "text": "Thick black smoke visible from miles away.", "location": "Blue Area"},
            {"source": "Citizen", "text": "People trapped on the 4th floor! Help!", "location": "Blue Area"}
        ]
    },
    {
        "id": "3",
        "name": "Major Traffic Incident (Medium Severity)",
        "signals": [
            {"source": "Citizen", "text": "Multi-car pileup on the expressway.", "location": "Expressway"},
            {"source": "Citizen", "text": "Road blocked near the bridge. Traffic at a standstill.", "location": "Expressway"},
            {"source": "Citizen", "text": "Avoid the expressway! Massive accident.", "location": "Expressway"}
        ]
    },
    {
        "id": "4",
        "name": "Extreme Heatwave (Low Severity)",
        "signals": [
            {"source": "Citizen", "text": "It's 45 degrees outside. Too hot to walk.", "location": "Citywide"},
            {"source": "Citizen", "text": "Old lady fainted at the bus stop due to heat.", "location": "Citywide"},
            {"source": "Sensor", "text": "Temperatures reaching record highs today.", "location": "Citywide"}
        ]
    },
    {
        "id": "5",
        "name": "False Alarm / Normal State",
        "signals": [
            {"source": "Citizen", "text": "Beautiful weather in Islamabad today!", "location": "Islamabad"},
            {"source": "Citizen", "text": "Coffee at Markaz is great.", "location": "Markaz"}
        ]
    }
]

def run_tests():
    print("="*40)
    print("CIRO SYSTEM TEST SCENARIOS EXECUTION")
    print("="*40)
    
    results = []
    
    for case in CASES:
        print(f"\n🚀 Running Scenario {case['id']}: {case['name']}")
        
        # 1. Reset
        requests.post(f"{API_BASE}/reset")
        print("[-] System Reset")
        
        # 2. Send Signals
        requests.post(f"{API_BASE}/signals", json=case['signals'])
        print(f"[-] {len(case['signals'])} signals injected")
        
        # 3. Analyze
        requests.post(f"{API_BASE}/analyze")
        print("[-] Triggering Neural Analysis...")
        
        # 4. Wait
        print("[-] Processing (approx 7 seconds)...")
        time.sleep(7)
        
        # 5. Verify
        try:
            crisis = requests.get(f"{API_BASE}/crisis").json()
            actions_data = requests.get(f"{API_BASE}/actions").json()
            actions = actions_data.get("actions", [])
            
            crisis_type = crisis.get('crisis_type', 'None')
            print(f"[OK] DETECTION: {crisis_type}")
            print(f"[OK] ACTIONS: {len(actions)} steps executed.")
            
            action_titles = [act.get('title', 'Unknown') for act in actions]
            if action_titles:
                print(f"     -> {', '.join(action_titles)}")
                
            results.append({
                "scenario": case['name'],
                "crisis": crisis_type,
                "actions": len(actions)
            })
        except Exception as e:
            print(f"[FAIL] Error retrieving results: {e}")
            results.append({
                "scenario": case['name'],
                "crisis": "ERROR",
                "actions": 0
            })
            
    print("\n" + "="*40)
    print("TEST SUITE SUMMARY")
    print("="*40)
    for res in results:
        print(f"{res['scenario']}")
        print(f"  -> Crisis: {res['crisis']}")
        print(f"  -> Actions Taken: {res['actions']}\n")

if __name__ == "__main__":
    run_tests()
