from pydantic import BaseModel
from typing import List, Optional

class CrisisReport(BaseModel):
    crisis_type: str
    location: str
    severity: str
    confidence: float
    affected_area_km2: Optional[float] = None
    estimated_vehicles_stranded: Optional[int] = None
    reasoning: str
    detailed_reasoning: Optional[str] = None
    future_risk_prediction: Optional[str] = None
    affected_entities: Optional[List[str]] = []
    signals_count: int
