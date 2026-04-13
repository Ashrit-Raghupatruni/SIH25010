import requests
try:
    res = requests.post("http://localhost:8000/api/chat/", json={"message":"hello", "language":"en", "context":""})
    print(res.status_code)
    print(res.text)
except Exception as e:
    print("Error:", e)
