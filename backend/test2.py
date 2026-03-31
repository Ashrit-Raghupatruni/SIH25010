import requests
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv('GOOGLE_API_KEY').strip()
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
headers = {'Content-Type': 'application/json'}
data = {
    "contents": [{"parts": [{"text": "Hello, how are you?"}]}]
}
try:
    response = requests.post(url, headers=headers, json=data, timeout=30)
    print("Status code:", response.status_code)
    if response.status_code != 200:
        print(response.text)
    else:
        print("Success:", response.json().get('candidates', [{}])[0].get('content'))
except Exception as e:
    print("Error:", e)
