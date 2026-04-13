import os
from dotenv import load_dotenv
import requests

load_dotenv()
api_key = os.getenv('price_api_key')

url = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"

# Fetch a general sample
params = {
    "api-key": api_key,
    "format": "json",
    "limit": 100,
}

try:
    resp = requests.get(url, params=params, timeout=10)
    records = resp.json().get("records", [])
    
    print("Fetched", len(records), "records.")
    if records:
        print("Sample of states:", list(set([r.get('state') for r in records])))
        print("Sample of crops:", list(set([r.get('commodity') for r in records]))[:20])
        
        # Searching for Cotton or Andhra
        print("Looking for Andhra Pradesh:", any(r.get('state') == 'Andhra Pradesh' for r in records))
        print("Looking for Cotton:", any('Cotton' in r.get('commodity', '') for r in records))
except Exception as e:
    print("Error:", e)
