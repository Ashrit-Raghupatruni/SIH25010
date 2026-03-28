from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
try:
    import tensorflow as tf
except Exception as e:
    tf = None
    print(f"Skipping TF due to {e}")
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
        if not tf:
            raise HTTPException(status_code=500, detail="TensorFlow is not installed.")
        model = get_disease_model()
        if not model:
            raise HTTPException(status_code=500, detail="Model could not be loaded because TensorFlow is unavailable.")
        infer = model.signatures["serving_default"]
        output = infer(tf.constant(img, dtype=tf.float16))
        probs = list(output.values())[0].numpy().squeeze()
        if probs.ndim == 2 and probs.shape[0] == 1:
            probs = probs[0]
        print("RAW PROBS:", probs[:5])
        print("SUM:", probs.sum())

        class_names = get_class_names()
        if len(class_names) != len(probs):
            raise HTTPException(status_code=500, detail="Model and class names mismatch")

        idx = int(np.argmax(probs))
        confidence = float(np.max(probs))
        disease_name = class_names[idx]

        solutions = get_disease_solutions()
        recommended_solution = solutions.get(disease_name, "No solution available")

        top5 = probs.argsort()[-5:][::-1]

        for i in top5:
            print(class_names[i], probs[i])
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
