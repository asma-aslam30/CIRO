from fastapi import APIRouter
from database.state import state

router = APIRouter()

@router.get("/crisis")
async def get_crisis():
    if state.current_crisis:
        return state.current_crisis
    return {"crisis": "None", "status": "Clear"}
