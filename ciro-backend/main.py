import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from routers import signals, crisis, actions, auth, autopilot
from database.state import state
# Deployment trigger - v1.0.0
from database.socket_manager import manager
from database.db import init_db

app = FastAPI(title="CIRO — Startup Level Orchestrator")

# Initialize database tables (creates users table if not exists)
init_db()


def get_allowed_origins() -> list:
    """Read CORS origins from ALLOWED_ORIGINS env var (comma-separated).
    Falls back to localhost defaults for local development."""
    raw = os.environ.get("ALLOWED_ORIGINS", "")
    if raw.strip():
        return [o.strip() for o in raw.split(",") if o.strip()]
    return [
        "http://localhost:8081",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:8081",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]


# Allow web frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    # No complex auth for now to ensure demo works
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.get("/")
async def root():
    return {"message": "CIRO Startup API", "version": "2.0.0"}

@app.post("/api/reset")
async def reset_state():
    state.reset()
    return {"status": "reset"}

app.include_router(signals.router, prefix="/api")
app.include_router(crisis.router, prefix="/api")
app.include_router(actions.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(autopilot.router, prefix="/api")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)
