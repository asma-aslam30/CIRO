from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Signal(BaseModel):
    source: str
    text: str
    timestamp: datetime = datetime.now()
    location: Optional[str] = None
    severity: Optional[str] = None
    type: Optional[str] = None
