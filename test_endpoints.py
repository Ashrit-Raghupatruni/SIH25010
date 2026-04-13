import sys
import asyncio
from pathlib import Path

sys.path.append(str(Path("d:/New folder/python_pro/SIH25010/backend")))

from utils.model_loader import initialize_models
from routes.crop_recommendation import recommend_crop, full_recommendation, smart_recommendation
from routes.fertilizer import recommend_fertilizer
from models.schemas import CropRecommendationInput, SmartCropInput, FertilizerInput

print("Initializing models...")
try:
    initialize_models()
except Exception as e:
    print("Startup error:", e)

async def test_all():
    print("\n--- Testing Crop Recommendation ---")
    crop_payload = CropRecommendationInput(
        nitrogen=90,
        phosphorus=42,
        potassium=43,
        temperature=20.8,
        humidity=82.0,
        ph=6.5,
        rainfall=202.9
    )
    
    try:
        response = await recommend_crop(crop_payload)
        print("Crop Recommend Response:", response.body if hasattr(response, 'body') else response)
    except Exception as e:
        print("Crop Recommend Error:", e)

    print("\n--- Testing Fertilizer Recommendation ---")
    fert_payload = FertilizerInput(
        nitrogen=90,
        phosphorus=42,
        potassium=43,
        temperature=20.8,
        humidity=82.0,
        ph=6.5,
        rainfall=202.9,
        label="rice"
    )
    
    try:
        response = await recommend_fertilizer(fert_payload)
        print("Fertilizer Recommend Response:", response)
    except Exception as e:
        print("Fertilizer Recommend Error:", e)

asyncio.run(test_all())
