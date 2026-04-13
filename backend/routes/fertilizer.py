import traceback

from fastapi import APIRouter, HTTPException
from models.schemas import FertilizerInput
from utils.model_loader import get_fertilizer_model, get_fertname_dict

router = APIRouter(prefix="/fertilizer", tags=["fertilizer"])

@router.post("/recommend")
async def recommend_fertilizer(payload: FertilizerInput):
    model = get_fertilizer_model()

    try:
        try:
            mapped_label = crop_labels.index(payload.label.lower())
        except ValueError:
            mapped_label = 20 # default to rice if not found

        features_arr = [[
            payload.nitrogen,
            payload.phosphorus,
            payload.potassium,
            payload.temperature,
            payload.humidity,
            payload.ph,
            payload.rainfall,
            mapped_label
        ]]

        try:
            import pandas as pd
            features = pd.DataFrame([{
                'N': payload.nitrogen,
                'P': payload.phosphorus,
                'K': payload.potassium,
                'temperature': payload.temperature,
                'humidity': payload.humidity,
                'ph': payload.ph,
                'rainfall': payload.rainfall,
                'label': mapped_label
            }])
            prediction = model.predict(features)
        except Exception:
            prediction = model.predict(features_arr)

        fertilizer_id = prediction[0]
        fertname_dict = get_fertname_dict()
        
        try:
            fertilizer_name = fertname_dict.get(int(fertilizer_id), str(fertilizer_id))
        except Exception:
            fertilizer_name = str(fertilizer_id)

        return {
            "recommended_fertilizer": fertilizer_name
        }
    except Exception as e:
        print("FERTILIZER ERROR:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
