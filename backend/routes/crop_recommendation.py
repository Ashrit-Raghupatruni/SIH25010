from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

import numpy as np

from models.schemas import CropRecommendationInput
from utils.model_loader import get_crop_model
from .weather import fetch_weather
from models.schemas import SmartCropInput

router = APIRouter(prefix="/crop", tags=["crop"])

crop_info = {
    "rice": {"water": "high", "growth": "120 days"},
    "maize": {"water": "medium", "growth": "90 days"},
    "muskmelon": {"water": "medium", "growth": "80-90 days"},
    "apple": {"water": "medium", "growth": "150 days"},
    "banana": {"water": "high", "growth": "11-12 months"},
    # add more later
}

# ✅ helper function
def analyze_conditions(payload):
    advice = []

    if payload.nitrogen < 50:
        advice.append("Increase nitrogen")

    if payload.ph < 6:
        advice.append("Soil is acidic, add lime")
    elif payload.ph > 7.5:
        advice.append("Soil is alkaline, add sulfur")

    return advice if advice else ["Conditions look good"]


@router.post("/recommend")
async def recommend_crop(payload: CropRecommendationInput):
    model = get_crop_model()

    features = [[
        payload.nitrogen,
        payload.phosphorus,
        payload.potassium,
        payload.temperature,
        payload.humidity,
        payload.ph,
        payload.rainfall
    ]]

    crop_labels = [
        "apple", "banana", "blackgram", "chickpea", "coconut",
        "coffee", "cotton", "grapes", "jute", "kidneybeans",
        "lentil", "maize", "mango", "mothbeans", "mungbean",
        "muskmelon", "orange", "papaya", "pigeonpeas",
        "pomegranate", "rice", "watermelon"
    ]

    try:
        predicted_crop = model.predict(features)
        index = int(predicted_crop[0])
        recommended = crop_labels[index]

        # ✅ use advice function
        advice = analyze_conditions(payload)

        return JSONResponse(
            status_code=200,
            content={
                "recommended_crop": recommended,
                "fertilizer_advice": advice,
                "soil_condition": "optimal" if "Conditions look good" in advice else "needs attention"
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/full")
async def full_recommendation(payload: CropRecommendationInput):
    model = get_crop_model()

    features = [[
        payload.nitrogen,
        payload.phosphorus,
        payload.potassium,
        payload.temperature,
        payload.humidity,
        payload.ph,
        payload.rainfall
    ]]

    crop_labels = [
        "apple", "banana", "blackgram", "chickpea", "coconut",
        "coffee", "cotton", "grapes", "jute", "kidneybeans",
        "lentil", "maize", "mango", "mothbeans", "mungbean",
        "muskmelon", "orange", "papaya", "pigeonpeas",
        "pomegranate", "rice", "watermelon"
    ]

    try:
        # 🌾 Crop prediction
        predicted_crop = model.predict(features)
        index = int(predicted_crop[0])
        recommended = crop_labels[index]

        # 🌱 Reuse soil logic
        advice = analyze_conditions(payload)

        if payload.ph < 6:
            soil_status = "Acidic soil"
        elif payload.ph > 7.5:
            soil_status = "Alkaline soil"
        else:
            soil_status = "Soil is balanced"

        return {
            "recommended_crop": recommended,
            "soil_status": soil_status,
            "fertilizer_advice": advice
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
@router.post("/smart")
def smart_recommendation(payload: SmartCropInput):

    model = get_crop_model()

    crop_labels = [
        "apple", "banana", "blackgram", "chickpea", "coconut",
        "coffee", "cotton", "grapes", "jute", "kidneybeans",
        "lentil", "maize", "mango", "mothbeans", "mungbean",
        "muskmelon", "orange", "papaya", "pigeonpeas",
        "pomegranate", "rice", "watermelon"
    ]
    try:
        probs = model.predict_proba(features)
        confidence = float(max(probs[0]))
    except:
        confidence = None  # fallback if not supported

    try:
        # ✅ Clean weather call
        weather_data = fetch_weather(payload.location)

        temperature = weather_data["temperature"]
        humidity = weather_data["humidity"]
        rainfall = weather_data["rainfall"]

        features = [[
            payload.nitrogen,
            payload.phosphorus,
            payload.potassium,
            temperature,
            humidity,
            payload.ph,
            rainfall
        ]]

        predicted_crop = model.predict(features)
        recommended = crop_labels[int(predicted_crop[0])]

        advice = analyze_conditions(payload)

        if payload.ph < 6:
            soil_status = "Acidic soil"
        elif payload.ph > 7.5:
            soil_status = "Alkaline soil"
        else:
            soil_status = "Soil is balanced"

        return {
            "recommended_crop": recommended,
            "temperature": temperature,
            "humidity": humidity,
            "rainfall": rainfall,
            "soil_status": soil_status,
            "fertilizer_advice": advice,
            "confidence": confidence,
            "info" : crop_info.get(recommended, {})
        }

    except Exception as e:
        print("SMART ERROR:", str(e))   # 🔥 add this
        raise HTTPException(status_code=500, detail=str(e))
