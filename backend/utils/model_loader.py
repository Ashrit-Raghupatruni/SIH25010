import os
import json
from pathlib import Path
from typing import Optional

import numpy as np
try:
    from sklearn.base import BaseEstimator
    HAS_SKLEARN = True
except Exception as e:
    HAS_SKLEARN = False
    BaseEstimator = object
    print(f"Skipping sklearn due to {e}")
try:
    import tensorflow as _tf
    keras = _tf.keras
    HAS_TF = True
    print(f"TensorFlow {_tf.__version__} loaded successfully.")
except Exception as e:
    HAS_TF = False
    keras = None
    print(f"Skipping TF due to {e}")

MODEL_DIR = Path(__file__).resolve().parents[2] / "saved_model"
# Model is saved as .h5 file (Keras HDF5 format from Colab training)
DISEASE_MODEL_PATH = MODEL_DIR / "plant_saved_model_tf.h5"
CLASS_NAMES_PATH = MODEL_DIR / "class_names.txt"
DISEASE_SOLUTIONS_PATH = Path(__file__).resolve().parents[1] / "models" / "disease_solutions.json"
CROP_MODEL_PATH = MODEL_DIR / "crop_recomen.pkl"
FERTILIZER_MODEL_PATH = MODEL_DIR / "xgb_pipeline.pkl"
FERTNAME_DICT_PATH = MODEL_DIR / "fertname_dict.pkl"

print("MODEL_DIR:", MODEL_DIR)
print("Exists:", MODEL_DIR.exists())

class LoadedModels:
    disease_model = None
    crop_model: Optional[BaseEstimator] = None
    class_names: list[str] = []
    disease_solutions: dict[str, str] = {}
    fertilizer_model = None
    fertname_dict: dict[int, str] = {}


loaded = LoadedModels()


def load_class_names(model=None) -> list[str]:
    """Load class names from file. Falls back to model output shape if file is missing."""
    if CLASS_NAMES_PATH.exists():
        with open(CLASS_NAMES_PATH, "r", encoding="utf-8") as f:
            names = [line.strip() for line in f if line.strip()]
        print(f"Loaded {len(names)} class names from {CLASS_NAMES_PATH}")
        return names
    if model is not None:
        # Auto-generate placeholder names from model output shape
        num_classes = model.output_shape[-1]
        print(f"[WARNING] class_names.txt not found. Generating {num_classes} placeholder names.")
        return [f"class_{i}" for i in range(num_classes)]
    print("[WARNING] class_names.txt not found and no model available. Class names will be empty.")
    return []


def load_disease_model():
    if not HAS_TF:
        print("TensorFlow not installed. Disease model not loaded.")
        return None
    if not DISEASE_MODEL_PATH.exists():
        print(f"[WARNING] Disease model not found at {DISEASE_MODEL_PATH}")
        return None
    print(f"Loading disease model from {DISEASE_MODEL_PATH}...")
    model = keras.models.load_model(str(DISEASE_MODEL_PATH))
    print("Disease model loaded successfully.")
    return model


def load_crop_model():
    import joblib
    if not CROP_MODEL_PATH.exists():
        return None
    try:
        return joblib.load(CROP_MODEL_PATH)
    except Exception as e:
        print("Failed to load crop model:", e)
        return None


def load_disease_solutions() -> dict[str, str]:
    if DISEASE_SOLUTIONS_PATH.exists():
        with open(DISEASE_SOLUTIONS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def load_fertilizer_model():
    import joblib
    if not FERTILIZER_MODEL_PATH.exists():
        return None
    try:
        return joblib.load(FERTILIZER_MODEL_PATH)
    except Exception as e:
        print("Failed to load fertilizer model:", e)
        return None

def load_fertname_dict():
    import joblib
    if not FERTNAME_DICT_PATH.exists():
        return {}
    try:
        return joblib.load(FERTNAME_DICT_PATH)
    except Exception as e:
        print("Failed to load fertname dict:", e)
        return {}

def initialize_models():
    loaded.disease_model = load_disease_model()
    # Pass the model so class names can be inferred from output shape if txt is missing
    loaded.class_names = load_class_names(model=loaded.disease_model)
    loaded.disease_solutions = load_disease_solutions()
    loaded.crop_model = load_crop_model()
    loaded.fertilizer_model = load_fertilizer_model()
    loaded.fertname_dict = load_fertname_dict()


def get_disease_model():
    """Returns the disease model, or None if not loaded (caller handles None)."""
    return loaded.disease_model


def get_crop_model():
    if loaded.crop_model is None:
        raise RuntimeError("Crop model not loaded")
    return loaded.crop_model


def get_class_names():
    return loaded.class_names


def get_disease_solutions():
    return loaded.disease_solutions

def get_fertilizer_model():
    if loaded.fertilizer_model is None:
        raise RuntimeError("Fertilizer model not loaded")
    return loaded.fertilizer_model

def get_fertname_dict():
    return loaded.fertname_dict