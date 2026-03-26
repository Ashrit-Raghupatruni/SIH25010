# Smart Agriculture Backend (FastAPI)

## Features
- Crop disease detection via image upload
- Crop recommendation using soil and climate features
- Soil analysis manual input support
- Weather integration endpoint (OpenWeather structure)
- CORS enabled
- Swagger auto-generated docs
- Models loaded once at startup

## Project structure
```
smart_agriculture_backend/
├── main.py
├── requirements.txt
├── README.md
├── models/
│   ├── schemas.py
│   ├── disease_solutions.json
│   └── crop_model.pkl (expected)
│   └── saved_model/ (contains plant_saved_model_tf and class_names.txt) 
├── routes/
│   ├── disease.py
│   ├── crop_recommendation.py
│   ├── soil.py
│   └── weather.py
└── utils/
    ├── model_loader.py
    └── preprocessing.py
```

## Setup
1. Create a virtual environment
   - `python -m venv venv`
   - `venv\Scripts\activate`
2. Install dependencies
   - `pip install -r requirements.txt`
3. Copy pretrained model files:
   - `SIH25010/models/plant_saved_model_tf` (TensorFlow SavedModel directory)
   - `SIH25010/models/class_names.txt`
   - `models/crop_model.pkl` (sklearn model)
   - Optionally edit `routes/weather.py` with your OpenWeather API key.

## Run
- `uvicorn main:app --reload --host 0.0.0.0 --port 8000`

## API Endpoints
### Health check
- GET `/`

### Disease detection
- POST `/disease/detect`
- Body: multipart/form-data, key `file` (image)
- Response: `disease_name`, `confidence`, `recommended_solution`

### Crop recommendation
- POST `/crop/recommend`
- JSON body:
  ```json
  {
    "nitrogen": 90,
    "phosphorus": 42,
    "potassium": 43,
    "ph": 6.5,
    "temperature": 30,
    "humidity": 70
  }
  ```
- Response: `recommended_crop`

### Soil analysis
- POST `/soil/analyze`
- JSON body:
  ```json
  {
    "nitrogen": 10,
    "phosphorus": 20,
    "potassium": 30,
    "ph": 7.2
  }
  ```
- Response: `status`, `message`, `ocr_ready`

### Weather lookup
- POST `/weather/current`
- JSON body: `{ "location": "London" }`
- Response: `location`, `temperature`, `humidity`, `rainfall`

## Example curl requests
- Disease detection:
  ```bash
  curl -X POST "http://localhost:8000/disease/detect" -F "file=@/path/to/leaf.jpg"
  ```
- Crop recommendation:
  ```bash
  curl -X POST "http://localhost:8000/crop/recommend" -H "Content-Type: application/json" -d '{"nitrogen":90, "phosphorus":42, "potassium":43, "ph":6.5, "temperature":30.2, "humidity":70.0}'
  ```
- Soil analysis:
  ```bash
  curl -X POST "http://localhost:8000/soil/analyze" -H "Content-Type: application/json" -d '{"nitrogen":10, "phosphorus":20, "potassium":30, "ph":7.2}'
  ```
- Weather integration:
  ```bash
  curl -X POST "http://localhost:8000/weather/current" -H "Content-Type: application/json" -d '{"location":"Delhi"}'
  ```

## Notes
- Add support for multi-language through external resource files in future.
- Add logging using Python `logging` module for production readiness.
- Add authentication & rate limiting for production-grade security.
