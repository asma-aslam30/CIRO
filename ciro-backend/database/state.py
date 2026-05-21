from typing import List, Dict
from models.signal import Signal
from models.crisis import CrisisReport
from database.db import SessionLocal, SignalDB, CrisisDB, ActionDB, init_db
from database.socket_manager import manager
import asyncio
from datetime import datetime

class GlobalState:
    def __init__(self):
        init_db()
        self.signals: List[Signal] = []
        self.current_crisis: CrisisReport = None
        self.crisis_history: List[Dict] = []   # <-- NEW: full history
        self.action_log: List[Dict] = []
        self.system_state: Dict = {"before": {}, "after": {}}

    def add_signal(self, signal: Signal):
        self.signals.append(signal)
        
        # Save to DB
        db = SessionLocal()
        db_signal = SignalDB(
            source=signal.source,
            text=signal.text,
            location=signal.location
        )
        db.add(db_signal)
        db.commit()
        db.close()
        
        # Notify Dashboard
        asyncio.create_task(manager.broadcast({
            "type": "SIGNAL_RECEIVED", 
            "count": len(self.signals),
            "last_location": signal.location
        }))


    def set_crisis(self, crisis: CrisisReport):
        self.current_crisis = crisis
        
        # Build history entry with timestamp
        crisis_dict = crisis.dict()
        crisis_dict["detected_at"] = datetime.now().strftime("%H:%M:%S")
        crisis_dict["id"] = len(self.crisis_history) + 1

        # Only add to history if not a duplicate of the very last entry
        if (not self.crisis_history or 
            self.crisis_history[-1]["crisis_type"] != crisis_dict["crisis_type"] or 
            self.crisis_history[-1]["location"] != crisis_dict["location"]):
            self.crisis_history.append(crisis_dict)

        # Save to DB
        db = SessionLocal()
        db_crisis = CrisisDB(
            type=crisis.crisis_type,
            location=crisis.location,
            severity=crisis.severity,
            confidence=crisis.confidence,
            reasoning=crisis.reasoning,
            signals_count=crisis.signals_count
        )
        db.add(db_crisis)
        db.commit()
        db.close()
        
        # Notify Dashboard — send full history too
        asyncio.create_task(manager.broadcast({
            "type": "CRISIS_DETECTED", 
            "data": crisis_dict,
            "all_crises": self.crisis_history
        }))

    def log_action(self, action: str, status: str, detail: str, time: str):
        log_entry = {
            "action": action,
            "title": action,
            "status": status,
            "detail": detail,
            "time": time
        }
        self.action_log.append(log_entry)
        
        # Save to DB
        db = SessionLocal()
        # Find latest crisis to link to
        latest_crisis = db.query(CrisisDB).order_by(CrisisDB.id.desc()).first()
        db_action = ActionDB(
            crisis_id=latest_crisis.id if latest_crisis else None,
            action=action,
            status=status,
            detail=detail,
            time=time
        )
        db.add(db_action)
        db.commit()
        db.close()
        
        # Notify Dashboard
        asyncio.create_task(manager.broadcast({
            "type": "ACTION_EXECUTED", 
            "data": log_entry
        }))

    def reset(self):
        self.signals.clear()
        self.current_crisis = None
        self.action_log.clear()
        self.system_state = {"before": {}, "after": {}}
        # NOTE: crisis_history intentionally NOT cleared so map keeps all pins
        asyncio.create_task(manager.broadcast({
            "type": "SYSTEM_RESET",
            "all_crises": self.crisis_history  # keep history alive on frontend
        }))

state = GlobalState()
