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
        "filters[state.keyword]": request.state,
        "filters[district]": request.district,
        "filters[commodity]": request.crop
    }

    if request.variety:
        params["filters[variety]"] = request.variety

    try:
        resp = requests.get(url, params=params, timeout=10)
        resp.raise_for_status()
        data = resp.json()

        if not data.get("records"):
            raise HTTPException(status_code=404, detail="No data found")

        return data["records"]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def fetch_price(crop: str, state: str, district: str, variety: str = None):
    api_key = os.getenv('price_api_key')

    url = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"

    params = {
        "api-key": api_key,
        "format": "json",
        "limit": 1,
        "filters[state.keyword]": state,
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