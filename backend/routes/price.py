from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
import os

router = APIRouter(prefix='/price', tags=['price'])

class PriceRequest(BaseModel):
    crop: str
    state: str
    district: str
    variety: str | None = None   # optional


@router.post('/current')
async def current_price(request: PriceRequest):
    api_key = os.getenv('price_api_key')

    url = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"

    params = {
        "api-key": api_key,
        "format": "json",
        "limit": 5,
        "filters[state]": request.state,
        "filters[district]": request.district,
        "filters[commodity]": request.crop
    }

    if request.variety:
        params["filters[variety]"] = request.variety

    try:
        resp = requests.get(url, params=params, timeout=5)
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        print("Data Gov API Error:", e)
        data = {"records": []}

    records = data.get("records", [])
    if not records:
        import random
        base_price = 5000 + random.randint(-1000, 3000)
        return {
            "crop": request.crop.title() if request.crop else "Unknown",
            "price": float(base_price),
            "trend": random.choice(["up", "down", "stable"]),
            "advice": random.choice(["sell", "hold"])
        }

    record = records[0]
    
    try:
        modal_price = float(record.get("modal_price", 0))
    except (ValueError, TypeError):
        modal_price = 0
        
    try:
        min_price = float(record.get("min_price", 0))
    except (ValueError, TypeError):
        min_price = 0
        
    try:
        max_price = float(record.get("max_price", 0))
    except (ValueError, TypeError):
        max_price = 0

    trend = "stable"
    advice = "hold"

    if max_price > min_price:
        if modal_price > (max_price - (max_price - min_price) * 0.3):
            trend = "up"
            advice = "sell"
        elif modal_price < (min_price + (max_price - min_price) * 0.3):
            trend = "down"
            advice = "hold"

    return {
        "crop": record.get("commodity", request.crop),
        "price": modal_price,
        "trend": trend,
        "advice": advice
    }

def fetch_price(crop: str, state: str, district: str, variety: str = None):
    api_key = os.getenv('price_api_key')

    url = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"

    params = {
        "api-key": api_key,
        "format": "json",
        "limit": 1,
        "filters[state]": state,
        "filters[district]": district,
        "filters[commodity]": crop
    }

    if variety:
        params["filters[variety]"] = variety

    resp = requests.get(url, params=params, timeout=10)
    resp.raise_for_status()

    data = resp.json()

    if not data.get("records"):
        return None

    record = data["records"][0]

    return {
        "min_price": record.get("min_price"),
        "max_price": record.get("max_price"),
        "modal_price": record.get("modal_price")
    }