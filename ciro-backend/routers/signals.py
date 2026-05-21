from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List
from models.signal import Signal
from database.state import state
from agents.antigravity import orchestrator
from mock_data import generator

router = APIRouter()

@router.get("/signals/random/{category}")
async def get_random_signal(category: str):
    signal = generator.generate_random(category)
    if not signal:
        raise HTTPException(status_code=400, detail="Invalid category")
    return signal

@router.post("/signals")
async def receive_signals(signals: List[Signal]):
    for signal in signals:
        state.add_signal(signal)
    return {"status": "success", "message": f"{len(signals)} signals received"}

@router.post("/analyze")
async def analyze_crisis(background_tasks: BackgroundTasks):
    if not state.signals:
        raise HTTPException(status_code=400, detail="No signals to analyze")
    
    background_tasks.add_task(orchestrator.run_pipeline)
    return {"status": "processing", "message": "Antigravity pipeline triggered in background"}
