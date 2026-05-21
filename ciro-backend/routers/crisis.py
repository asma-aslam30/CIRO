from fastapi import APIRouter
from database.state import state

router = APIRouter()

@router.get("/crisis")
async def get_crisis():
    if state.current_crisis:
        return state.current_crisis
    return {"crisis": "None", "status": "Clear"}

@router.get("/crisis/history")
async def get_crisis_history():
    return {"history": state.crisis_history, "total": len(state.crisis_history)}




