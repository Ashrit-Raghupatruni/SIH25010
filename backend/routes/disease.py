from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

from utils.model_loader import get_disease_model, get_class_names, get_disease_solutions
from utils.preprocessing import preprocess_image

import numpy as np
import io

router = APIRouter(prefix="/disease", tags=["disease"])


@router.post("/detect")
async def detect_disease(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        raise HTTPException(status_code=400, detail="Invalid image type")
    body = await file.read()

    try:
        img = preprocess_image(body, target_size=(224, 224))
        model = get_disease_model()
        probs = model.predict(img, verbose=0)
        if probs.ndim == 2 and probs.shape[0] == 1:
            probs = probs[0]

        class_names = get_class_names()
        if len(class_names) != len(probs):
            raise HTTPException(status_code=500, detail="Model and class names mismatch")

        idx = int(np.argmax(probs))
        confidence = float(np.max(probs))
        disease_name = class_names[idx]

        solutions = get_disease_solutions()
        recommended_solution = solutions.get(disease_name, "No solution available")

        return JSONResponse(
            status_code=200,
            content={
                "disease_name": disease_name,
                "confidence": round(confidence, 4),
                "recommended_solution": recommended_solution,
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
