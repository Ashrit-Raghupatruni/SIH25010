from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

import numpy as np
from models.schemas import CropRecommendationInput
from utils.model_loader import get_crop_model

router = APIRouter(prefix="/crop", tags=["crop"])


@router.post("/recommend")
async def recommend_crop(payload: CropRecommendationInput):
    model = get_crop_model()
    features = [[
        payload.nitrogen,
        payload.phosphorus,
        payload.potassium,
        payload.ph,
        payload.temperature,
        payload.humidity,
    ]]

    try:
        predicted_crop = model.predict(features)
        if isinstance(predicted_crop, (list, tuple, np.ndarray)):
            recommended = str(predicted_crop[0])
        else:
            recommended = str(predicted_crop)

        return JSONResponse(status_code=200, content={"recommended_crop": recommended})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
