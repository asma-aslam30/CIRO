import asyncio
import json
from datetime import datetime
from database.state import state
from models.crisis import CrisisReport

class AntigravityOrchestrator:
    async def run_pipeline(self):
        print("\n" + "="*50)
        print("GOOGLE ANTIGRAVITY ORCHESTRATOR INITIATED")
        print("="*50 + "\n")

        # ---------------------------------------------------------
        # 1️⃣ SIGNAL AGENT
        # ---------------------------------------------------------
        print("Agent 1: Signal Agent - Normalizing inputs...")
        await asyncio.sleep(1)
        
        signal_output = {
            "location": "G-10 Islamabad",
            "keywords": ["flood", "water", "rain", "stuck", "pani"],
            "possible_crisis": ["urban flooding"],
            "traffic_level": "high",
            "weather_condition": "heavy rainfall",
            "signal_summary": "Multiple flood-related posts detected with heavy rainfall and severe traffic congestion."
        }
        print(json.dumps(signal_output, indent=2))
        
        # ---------------------------------------------------------
        # 2️⃣ DETECTION AGENT
        # ---------------------------------------------------------
        print("\nAgent 2: Detection Agent - Identifying crisis...")
        await asyncio.sleep(1.5)
        
        detection_output = {
            "crisis_type": "Urban Flooding",
            "severity": "High",
            "confidence": "92%",
            "impacted_areas": ["G-10", "Main Boulevard"],
            "infrastructure_impact": [
                "roads blocked",
                "vehicles stranded",
                "traffic congestion"
            ],
            "reasoning": "Heavy rainfall combined with flood-related social posts and congestion indicates urban flooding."
        }
        print(json.dumps(detection_output, indent=2))

        # ---------------------------------------------------------
        # 3️⃣ REASONING AGENT
        # ---------------------------------------------------------
        print("\nAgent 3: Reasoning Agent - Deep risk analysis...")
        await asyncio.sleep(1.5)
        
        reasoning_output = {
            "root_cause": "Heavy rainfall and poor drainage",
            "risk_level": "High",
            "future_risk_prediction": "Flood water may spread to nearby roads within 1 hour.",
            "affected_entities": [
                "commuters",
                "emergency vehicles",
                "nearby residents"
            ],
            "detailed_reasoning": "Continuous rainfall and blocked roads increase the probability of traffic paralysis and stranded citizens."
        }
        print(json.dumps(reasoning_output, indent=2))

        # Update System State with AI outputs
        crisis = CrisisReport(
            crisis_type=detection_output["crisis_type"],
            location=signal_output["location"],
            severity=detection_output["severity"].upper(),
            confidence=92.0,
            reasoning=detection_output["reasoning"],
            detailed_reasoning=reasoning_output["detailed_reasoning"],
            future_risk_prediction=reasoning_output["future_risk_prediction"],
            affected_entities=reasoning_output["affected_entities"],
            signals_count=len(state.signals) if state.signals else 3
        )
        state.set_crisis(crisis)

        # ---------------------------------------------------------
        # 4️⃣ PLANNING AGENT
        # ---------------------------------------------------------
        print("\nAgent 4: Planning Agent - Generating response strategy...")
        await asyncio.sleep(1.5)
        
        planning_output = {
            "priority_level": "Critical",
            "recommended_actions": [
                "Dispatch rescue teams",
                "Close flooded roads",
                "Activate emergency hotline"
            ],
            "traffic_plan": [
                "Redirect traffic to alternate routes",
                "Block entry to flooded streets"
            ],
            "resource_allocation": [
                "2 rescue vehicles",
                "medical response unit"
            ],
            "citizen_alerts": [
                "Avoid G-10 area",
                "Use alternate routes"
            ],
            "execution_order": [
                ("Road closure", "Traffic rerouted away from G-10"),
                ("Traffic rerouting", "Alternate routes designated on maps"),
                ("Emergency dispatch", "Rescue units deployed to stranded vehicles"),
                ("Public alerts", "SMS notifications dispatched to citizens")
            ]
        }
        print(json.dumps(planning_output, indent=2))

        # ---------------------------------------------------------
        # 5️⃣ SIMULATION AGENT
        # ---------------------------------------------------------
        print("\nAgent 5: Simulation Agent - Executing actions...")
        await asyncio.sleep(1)
        
        simulation_output = {
            "executed_actions": [
                "Traffic rerouted",
                "Emergency teams dispatched",
                "Citizen alerts sent"
            ],
            "system_logs": [],
            "before_state": {
                "traffic_congestion": "90%",
                "roads_blocked": 4
            },
            "after_state": {
                "traffic_congestion": "40%",
                "roads_blocked": 1
            },
            "simulation_summary": "Emergency actions significantly reduced congestion and improved traffic flow."
        }
        
        # Simulate sequential execution and logging
        for action_name, detail in planning_output["execution_order"]:
            await asyncio.sleep(1)
            timestamp = datetime.now().strftime("%H:%M:%S")
            log_str = f"[{timestamp}] {action_name} Executed"
            simulation_output["system_logs"].append(log_str)
            print(f"  -> {log_str}")
            
            # Log to DB and WebSocket
            state.log_action(
                action=action_name,
                status="EXECUTED",
                detail=detail,
                time=timestamp
            )

        print("\nSimulation Complete. Result:")
        print(json.dumps(simulation_output, indent=2))

        # ---------------------------------------------------------
        # 6️⃣ VISUALIZATION AGENT
        # ---------------------------------------------------------
        print("\nAgent 6: Visualization Agent - Updating Dashboards...")
        await asyncio.sleep(1)
        
        visualization_output = {
            "dashboard_title": "Karachi/Islamabad Flood Crisis Dashboard",
            "crisis_summary": "Urban flooding detected in G-10 due to heavy rainfall.",
            "timeline_logs": simulation_output["system_logs"],
            "status_cards": [
                "High Severity",
                "Emergency Active",
                "Traffic Controlled"
            ],
            "before_after_comparison": {
                "before_congestion": simulation_output["before_state"]["traffic_congestion"],
                "after_congestion": simulation_output["after_state"]["traffic_congestion"]
            },
            "final_status": "Situation stabilized after coordinated response."
        }
        print(json.dumps(visualization_output, indent=2))
        print("\n" + "="*50)
        print("PIPELINE EXECUTION FINISHED")
        print("="*50 + "\n")
        
        # Final state update for Next.js metrics UI
        state.system_state = {
            "before": {"congestion": "Critical", "risk": "High"},
            "after": {"congestion": "Stabilized", "risk": "Controlled"}
        }

        return crisis

orchestrator = AntigravityOrchestrator()
