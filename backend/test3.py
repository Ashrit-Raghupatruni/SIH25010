import requests
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv('GOOGLE_API_KEY').strip()
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
try:
    response = requests.get(url, timeout=30)
    print("Status code:", response.status_code)
    models = response.json().get('models', [])
    for m in models:
        print(m['name'])
except Exception as e:
    print("Error:", e)
