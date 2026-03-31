import traceback
from fastapi import APIRouter, HTTPException
from models.schemas import FertilizerInput
from utils.model_loader import get_fertilizer_model

router = APIRouter(prefix="/fertilizer", tags=["fertilizer"])

soil_mapping ={0: 'Black', 1: 'Clayey', 2: 'Loamy', 3: 'Red', 4: 'Sandy'}

crop_mapping ={0: 'Barley', 1: 'Cotton', 2: 'Ground Nuts', 3: 'Maize', 4: 'Millets', 5: 'Oil seeds', 6: 'Paddy', 7: 'Pulses', 8: 'Sugarcane', 9: 'Tobacco', 10: 'Wheat'}

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
