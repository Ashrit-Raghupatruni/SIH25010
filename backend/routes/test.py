import os
from dotenv import load_dotenv
import requests

load_dotenv()

api_key = os.getenv('price_api_key')

url = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"

params = {
    "api-key": api_key,
    "format": "json",
    "limit": 5,
    "filters[state.keyword]": "Andhra Pradesh",
    "filters[district]": "Guntur",
    "filters[commodity]": "Rice"
}

resp = requests.get(url, params=params, timeout=10)
data = resp.json()

# ✅ Correct key
print(data["records"][0]["modal_price"])