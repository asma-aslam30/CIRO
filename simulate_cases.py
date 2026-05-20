import requests
import time
import json

API_BASE = "http://localhost:8000/api"

CASES = {
    "1": {
        "name": "Urban Flooding",
        "signals": [
            {"source": "Citizen", "text": "Water levels rising quickly in F-6 Markaz!", "location": "F-6 Markaz"},
            {"source": "Citizen", "text": "Basements flooded. Need help.", "location": "F-6 Markaz"},
            {"source": "Sensor", "text": "Rainfall exceeded 50mm in 1 hour", "location": "F-6 Markaz"}
        ]
    },
    "2": {
        "name": "Structural Fire",
        "signals": [
            {"source": "Citizen", "text": "Huge fire at the commercial building in Blue Area!", "location": "Blue Area"},
            {"source": "Citizen", "text": "Thick black smoke visible. Explosion heard.", "location": "Blue Area"}
        ]
    },
    "3": {
        "name": "Traffic Accident",
        "signals": [
            {"source": "Citizen", "text": "Multi-car pileup on the expressway near Saddar.", "location": "Saddar"},
            {"source": "Traffic Cam", "text": "Accident detected. Lanes blocked.", "location": "Saddar"}
        ]
    },
    "4": {
        "name": "Heatwave",
        "signals": [
            {"source": "Citizen", "text": "It's too hot. 48 degrees reported.", "location": "F-6 Markaz"},
            {"source": "Health Dept", "text": "Increase in heat-stroke cases reported.", "location": "F-6 Markaz"}
        ]
    }
}

def run_case(case_id):
    case = CASES.get(case_id)
    if not case:
        print("Invalid case ID")
        return

    print(f"\n🚀 Running Case {case_id}: {case['name']}")
    
    # 1. Reset
    requests.post(f"{API_BASE}/reset")
    print("✓ System Reset")

    # 2. Send Signals
    requests.post(f"{API_BASE}/signals", json=case['signals'])
    print(f"✓ {len(case['signals'])} signals injected")

    # 3. Analyze
    requests.post(f"{API_BASE}/analyze")
    print("✓ Analysis triggered. Check the web dashboard!")

if __name__ == "__main__":
    print("CIRO Automated Test Runner")
    print("--------------------------")
    for k, v in CASES.items():
        print(f"{k}. {v['name']}")
    
    choice = input("\nEnter case number to run (or 'q' to quit): ")
    if choice.lower() != 'q':
        run_case(choice)
