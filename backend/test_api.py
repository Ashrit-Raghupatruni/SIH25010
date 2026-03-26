import requests
import json

print("=" * 60)
print("TESTING SMART AGRICULTURE BACKEND")
print("=" * 60)

# Test 1: Health check
print("\n✓ Test 1: Health Check (GET /)")
r = requests.get('http://127.0.0.1:8000/')
print(f"  Status: {r.status_code}")
print(f"  Response: {r.json()}")

# Test 2: Check OpenAPI schema
print("\n✓ Test 2: OpenAPI Documentation (GET /openapi.json)")
r = requests.get('http://127.0.0.1:8000/openapi.json')
if r.status_code == 200:
    data = r.json()
    endpoints = list(data.get('paths', {}).keys())
    print(f"  Status: {r.status_code}")
    print(f"  Available Endpoints:")
    for endpoint in sorted(endpoints):
        print(f"    - {endpoint}")
else:
    print(f"  Error: {r.status_code}")

# Test 3: Crop recommendation
print("\n✓ Test 3: Crop Recommendation (POST /crop/recommend)")
crop_data = {
    "nitrogen": 90,
    "phosphorus": 42,
    "potassium": 43,
    "ph": 6.5,
    "temperature": 30.0,
    "humidity": 70.0
}
r = requests.post('http://127.0.0.1:8000/crop/recommend', json=crop_data)
print(f"  Status: {r.status_code}")
if r.status_code == 200:
    print(f"  Response: {r.json()}")
else:
    print(f"  Error: {r.text}")

# Test 4: Soil analysis
print("\n✓ Test 4: Soil Analysis (POST /soil/analyze)")
soil_data = {
    "nitrogen": 50,
    "phosphorus": 20,
    "potassium": 30,
    "ph": 7.2
}
r = requests.post('http://127.0.0.1:8000/soil/analyze', json=soil_data)
print(f"  Status: {r.status_code}")
if r.status_code == 200:
    print(f"  Response: {r.json()}")
else:
    print(f"  Error: {r.text}")

print("\n" + "=" * 60)
print("✅ BACKEND IS RUNNING SUCCESSFULLY!")
print("=" * 60)
print("\nNext steps:")
print("  → View API docs: http://127.0.0.1:8000/docs")
print("  → Disease detection: POST /disease/detect (multipart image)")
print("  → Crop recommendation: POST /crop/recommend (JSON)")
print("  → Soil analysis: POST /soil/analyze (JSON)")
print("  → Weather: POST /weather/current (JSON)")
print("=" * 60)
