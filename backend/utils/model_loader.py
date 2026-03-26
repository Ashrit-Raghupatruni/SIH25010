import os
import json
from pathlib import Path
from typing import Optional

import numpy as np
from sklearn.base import BaseEstimator
from tensorflow import keras

MODEL_DIR = Path(__file__).resolve().parents[2] / "saved_model"
DISEASE_MODEL_PATH = MODEL_DIR / "plant_saved_model_tf"
CLASS_NAMES_PATH = MODEL_DIR / "class_names.txt"
DISEASE_SOLUTIONS_PATH = Path(__file__).resolve().parents[1] / "models" / "disease_solutions.json"
CROP_MODEL_PATH = MODEL_DIR / "crop_model.pkl"


class LoadedModels:
    disease_model: Optional[keras.Model] = None
    crop_model: Optional[BaseEstimator] = None
    class_names: list[str] = []
    disease_solutions: dict[str, str] = {}


loaded = LoadedModels()


def load_class_names() -> list[str]:
    if not CLASS_NAMES_PATH.exists():
        raise FileNotFoundError(f"class_names.txt not found at {CLASS_NAMES_PATH}")
    with open(CLASS_NAMES_PATH, "r", encoding="utf-8") as f:
        return [line.strip() for line in f if line.strip()]


def load_disease_model() -> keras.Model:
    if not DISEASE_MODEL_PATH.exists():
        raise FileNotFoundError(f"Disease model folder not found at {DISEASE_MODEL_PATH}")
    model = keras.models.load_model(str(DISEASE_MODEL_PATH))
    return model


def load_crop_model() -> Optional[BaseEstimator]:
    import pickle

    if not CROP_MODEL_PATH.exists():
        return None
    with open(CROP_MODEL_PATH, "rb") as f:
        return pickle.load(f)


def load_disease_solutions() -> dict[str, str]:
    if DISEASE_SOLUTIONS_PATH.exists():
        with open(DISEASE_SOLUTIONS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def initialize_models():
    loaded.disease_model = load_disease_model()
    loaded.class_names = load_class_names()
    loaded.disease_solutions = load_disease_solutions()
    loaded.crop_model = load_crop_model()


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
