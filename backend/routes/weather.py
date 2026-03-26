from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests

router = APIRouter(prefix="/weather", tags=["weather"])


class WeatherRequest(BaseModel):
    location: str


@router.post("/current")
async def current_weather(request: WeatherRequest):
    import os

    api_key = os.getenv("OPENWEATHER_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="OpenWeather API key not configured. Set OPENWEATHER_API_KEY env var."
        )
    url = "http://api.openweathermap.org/data/2.5/weather"
    params = {
        "q": request.location,
        "appid": api_key,
        "units": "metric",
    }

    try:
        resp = requests.get(url, params=params, timeout=10)
        resp.raise_for_status()
        data = resp.json()

        return {
            "location": request.location,
            "temperature": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "rainfall": data.get("rain", {}).get("1h", 0.0),
        }
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=str(e))
