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
    from tensorflow import keras
    HAS_TF = True
except Exception as e:
    HAS_TF = False
    keras = None
    print(f"Skipping TF due to {e}")

MODEL_DIR = Path(__file__).resolve().parents[2] / "saved_model"
DISEASE_MODEL_PATH = MODEL_DIR / "plant_saved_model_tf"
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


def load_class_names() -> list[str]:
    if not CLASS_NAMES_PATH.exists():
        raise FileNotFoundError(f"class_names.txt not found at {CLASS_NAMES_PATH}")
    with open(CLASS_NAMES_PATH, "r", encoding="utf-8") as f:
        return [line.strip() for line in f if line.strip()]


def load_disease_model():
    if not HAS_TF:
        print("TensorFlow not installed. Disease model not loaded.")
        return None
    if not DISEASE_MODEL_PATH.exists():
        raise FileNotFoundError(f"Disease model folder not found at {DISEASE_MODEL_PATH}")
    model = keras.models.load_model(str(DISEASE_MODEL_PATH))
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
    loaded.class_names = load_class_names()
    loaded.disease_solutions = load_disease_solutions()
    loaded.crop_model = load_crop_model()
    loaded.fertilizer_model = load_fertilizer_model()
    loaded.fertname_dict = load_fertname_dict()


def get_disease_model():
    if loaded.disease_model is None:
        raise RuntimeError("Disease model not loaded")
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