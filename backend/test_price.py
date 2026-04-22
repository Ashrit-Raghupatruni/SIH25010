import time
import requests

start = time.time()
try:
    resp = requests.post("http://localhost:8000/price/current", json={
        "crop": "Rice",
        "state": "Andhra Pradesh",
        "district": "Guntur"
    }, timeout=10)
    print("Status code:", resp.status_code)
    print("Response text:", resp.text)
except Exception as e:
    print("Exception:", e)
print("Time taken:", time.time() - start)
