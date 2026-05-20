import requests
import time
import json

API_BASE = "http://localhost:8000/api"

def run_test(name, signals):
    print(f"\nSTARTING ENTERPRISE TEST: {name}")
    
    # 1. Reset
    requests.post(f"{API_BASE}/reset")
    
    # 2. Inject Signals
    print(f"[-] Injecting {len(signals)} signals through city towers...")
    requests.post(f"{API_BASE}/signals", json=signals)
    
    # 3. Analyze
    print("[-] Triggering Neural Analysis...")
    requests.post(f"{API_BASE}/analyze")
    
    # 4. Wait
    print("[-] Processing (approx 7 seconds)...")
    time.sleep(7)
    
    # 5. Verify
    crisis = requests.get(f"{API_BASE}/crisis").json()
    actions = requests.get(f"{API_BASE}/actions").json()["actions"]
    
    print(f"[OK] DETECTION: {crisis.get('crisis_type', 'NONE')}")
    print(f"[OK] ACTIONS: {len(actions)} steps executed.")

    
    return crisis.get('crisis_type')

if __name__ == "__main__":
    results = []
    
    # CASE 1: Industrial Fire at F-6
    results.append(run_test("Industrial Fire (F-6)", [
        {"source": "SENSOR_01", "text": "Intense heat detected in factory zone", "location": "F-6 Markaz"},
        {"source": "TWITTER", "text": "Huge smoke plume over F-6 #Islamabad", "location": "F-6 Markaz"}
    ]))

    # CASE 2: High-Level Security Incident at Blue Area
    results.append(run_test("Security Breach (Blue Area)", [
        {"source": "POLICE_RADIO", "text": "Unauthorized entry detected in government sector", "location": "Blue Area"},
        {"source": "CCTV_AI", "text": "Suspicious activity in high-security zone", "location": "Blue Area"}
    ]))

    # CASE 3: Earthquake/Building Collapse at Saddar
    results.append(run_test("Seismic Incident (Saddar)", [
        {"source": "SEISMOGRAPH", "text": "Magnitude 5.2 tremor recorded", "location": "Saddar"},
        {"source": "CITIZEN", "text": "Buildings are shaking in Saddar area help!", "location": "Saddar"}
    ]))

    print("\n" + "="*30)
    print("ENTERPRISE TEST SUITE COMPLETE")
    print("="*30)
    for i, res in enumerate(results):
        print(f"Scenario {i+1}: {res if res else 'FAILED'}")
