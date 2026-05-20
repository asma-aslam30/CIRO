def dispatch_rescue_unit(location: str, unit_type: str):
    return {
        "status": "DISPATCHED",
        "unit_id": "RU-402",
        "type": unit_type,
        "eta_minutes": 15,
        "destination": location
    }

def send_public_alert(area: str, message: str):
    return {
        "status": "SENT",
        "recipient_count": 12400,
        "area": area,
        "message": message
    }
