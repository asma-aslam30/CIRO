def get_mock_weather(location: str):
    return {
        "location": location,
        "condition": "Heavy Rain",
        "precipitation_mm": 85,
        "alert": "Urban Flooding Warning",
        "timestamp": "2025-05-12T08:00:00"
    }
