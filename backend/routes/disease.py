from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
try:
    import tensorflow as tf
except Exception as e:
    tf = None
    print(f"Skipping TF due to {e}")
from utils.model_loader import get_disease_model, get_class_names, get_disease_solutions
from PIL import Image
import numpy as np
import io

router = APIRouter(prefix="/disease", tags=["disease"])


@router.post("/detect")
async def detect_disease(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        raise HTTPException(status_code=400, detail="Invalid image type")
    body = await file.read()

    try:
        if not tf:
            raise HTTPException(status_code=500, detail="TensorFlow is not installed.")

        model = get_disease_model()
        if model is None:
            raise HTTPException(status_code=500, detail="Disease model is not loaded.")

        # Preprocess: resize to 224x224, keep uint8 values (0-255).
        # The Keras model already has a Rescaling(1./127.5, offset=-1) layer internally.
        image = Image.open(io.BytesIO(body)).convert("RGB").resize((224, 224))
        img_array = np.array(image, dtype=np.float32)        # shape: (224, 224, 3)
        img_array = np.expand_dims(img_array, axis=0)        # shape: (1, 224, 224, 3)

        # Run inference using standard Keras predict
        probs = model.predict(img_array, verbose=0)[0]        # shape: (num_classes,)

        class_names = get_class_names()
        if len(class_names) != len(probs):
            raise HTTPException(
                status_code=500,
                detail=f"Model output size ({len(probs)}) != class names ({len(class_names)})"
            )

        idx = int(np.argmax(probs))
        confidence = float(np.max(probs))
        disease_name = class_names[idx]

        solutions = get_disease_solutions()
        recommended_solution = solutions.get(disease_name, "No solution available")

        # Debug: top-5 predictions
        top5_idx = probs.argsort()[-5:][::-1]
        top5 = [{"class": class_names[i], "confidence": round(float(probs[i]), 4)} for i in top5_idx]
        print("Top-5 predictions:", top5)

        return JSONResponse(
            status_code=200,
            content={
                "disease_name": disease_name,
                "confidence": round(confidence, 4),
                "recommended_solution": recommended_solution,
                "top5_predictions": top5,
            },
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
