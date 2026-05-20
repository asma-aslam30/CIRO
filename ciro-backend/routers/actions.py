from fastapi import APIRouter
from database.state import state

router = APIRouter()

@router.get("/actions")
async def get_actions():
    return {"actions": state.action_log}

@router.get("/state")
async def get_state():
    return state.system_state
