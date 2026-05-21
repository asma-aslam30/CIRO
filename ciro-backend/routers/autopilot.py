import asyncio
import random
from fastapi import APIRouter
from database.state import state
from database.socket_manager import manager
from models.signal import Signal
from agents.antigravity import orchestrator
from mock_data import generator

router = APIRouter()

# Autopilot state
_autopilot_enabled = False
_autopilot_task = None

CATEGORIES = ["social", "weather", "traffic", "power", "medical", "security"]


async def _autopilot_loop():
    """Background coroutine that continuously injects random signals and triggers analysis."""
    global _autopilot_enabled

    while _autopilot_enabled:
        try:
            # 1) Reset previous state for the dashboard UI
            state.reset()
            await asyncio.sleep(1)

            # 2) Rapidly inject and analyze 2 to 4 distinct incidents
            num_incidents = random.randint(2, 4)
            for i in range(num_incidents):
                if not _autopilot_enabled:
                    break
                
                # Pick 1 random signal for a distinct incident
                cat = random.choice(CATEGORIES)
                raw = generator.generate_random(cat)
                
                if raw:
                    # Clear signals list in backend so AI analyzes THIS incident cleanly
                    state.signals.clear()
                    
                    sig = Signal(
                        source=raw["source"],
                        text=raw["text"],
                        location=raw["location"],
                    )
                    state.add_signal(sig)
                    
                    await asyncio.sleep(0.5)
                    
                    # Trigger the AI pipeline
                    await orchestrator.run_pipeline()
                    
                    # Wait 2-3 seconds before detecting the next incident in this cycle
                    await asyncio.sleep(random.uniform(2, 3))

            # 4) Wait before the next big cycle
            delay = random.uniform(5, 8)
            await asyncio.sleep(delay)

        except asyncio.CancelledError:
            break
        except Exception as e:
            print(f"[AUTOPILOT] Error in loop: {e}")
            await asyncio.sleep(5)


@router.get("/autopilot")
async def get_autopilot_status():
    return {"enabled": _autopilot_enabled}


@router.post("/autopilot")
async def toggle_autopilot():
    global _autopilot_enabled, _autopilot_task

    _autopilot_enabled = not _autopilot_enabled

    if _autopilot_enabled:
        # Start the background loop
        _autopilot_task = asyncio.create_task(_autopilot_loop())
        print("[AUTOPILOT] Mode ENABLED — live feed simulator running.")
    else:
        # Cancel the background loop
        if _autopilot_task:
            _autopilot_task.cancel()
            _autopilot_task = None
        print("[AUTOPILOT] Mode DISABLED.")

    # Broadcast status to all connected clients
    await manager.broadcast({"type": "AUTOPILOT_STATUS", "enabled": _autopilot_enabled})

    return {"enabled": _autopilot_enabled}
