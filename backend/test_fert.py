import requests
try:
    resp = requests.post("http://localhost:8000/fertilizer/recommend", json={
        "nitrogen": 10,
        "phosphorus": 10,
        "potassium": 10,
        "temperature": 25.0,
        "humidity": 50.0,
        "ph": 6.5,
        "rainfall": 100.0,
        "label": "Rice"
    })
    print("Status code:", resp.status_code)
    print("Response text:", resp.text)
except Exception as e:
    print("Exception:", e)
