from typing import List, Dict
from models.signal import Signal
from models.crisis import CrisisReport
from database.db import SessionLocal, SignalDB, CrisisDB, ActionDB, init_db
from database.socket_manager import manager
import asyncio

class GlobalState:
    def __init__(self):
        init_db()
        self.signals: List[Signal] = []
        self.current_crisis: CrisisReport = None
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
        
        # Notify Dashboard
        asyncio.create_task(manager.broadcast({
            "type": "CRISIS_DETECTED", 
            "data": crisis.dict()
        }))

    def log_action(self, action: str, status: str, detail: str, time: str):
        log_entry = {
            "action": action,
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
        asyncio.create_task(manager.broadcast({"type": "SYSTEM_RESET"}))

state = GlobalState()
