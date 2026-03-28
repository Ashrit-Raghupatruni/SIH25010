import traceback
from fastapi import APIRouter, HTTPException
from models.schemas import FertilizerInput
from utils.model_loader import get_fertilizer_model

router = APIRouter(prefix="/fertilizer", tags=["fertilizer"])


# 🔧 Example mappings (adjust based on training)
soil_mapping = {
    "sandy": 0,
    "loamy": 1,
    "black": 2,
    "red": 3,
    "clay": 4
}

crop_mapping = {
    "rice": 0,
    "maize": 1,
    "cotton": 2,
    "sugarcane": 3,
    # extend as needed
}


@router.post("/recommend")
async def recommend_fertilizer(payload: FertilizerInput):
    model = get_fertilizer_model()

    try:
        soil = soil_mapping.get(payload.soil_type.lower())
        crop = crop_mapping.get(payload.crop_type.lower())

        if soil is None or crop is None:
            raise HTTPException(status_code=400, detail="Invalid soil or crop type")

        features = [[
            payload.temperature,
            payload.humidity,
            payload.moisture,
            soil,
            crop,
            payload.nitrogen,
            payload.potassium,
            payload.phosphorus
        ]]

        prediction = model.predict(features)

        fertilizer = prediction[0]

        return {
            "recommended_fertilizer": fertilizer
        }
    except Exception as e:
        print("FERTILIZER ERROR:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
