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


weather_cache = {}

def fetch_weather(location: str):
    import os
    import requests
    import time

    # 🔥 check cache first
    if location in weather_cache:
        cached_data, timestamp = weather_cache[location]
        if time.time() - timestamp < 600:  # 10 min cache
            return cached_data

    api_key = os.getenv("OPENWEATHER_API_KEY")

    url = "http://api.openweathermap.org/data/2.5/weather"

    params = {
        "q": location,
        "appid": api_key,
        "units": "metric",
    }

    resp = requests.get(url, params=params, timeout=10)
    resp.raise_for_status()
    data = resp.json()

    result = {
        "location": location,
        "temperature": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "rainfall": data.get("rain", {}).get("1h", 0.0),
    }

    # 🔥 store in cache
    weather_cache[location] = (result, time.time())

    return result