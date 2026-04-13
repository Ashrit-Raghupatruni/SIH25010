import joblib
import pickle
import sys
from pathlib import Path

MODEL_DIR = Path("d:/New folder/python_pro/SIH25010/saved_model")
fert_model_path = MODEL_DIR / "xgb_pipeline (3).pkl"

print(f"Loading {fert_model_path}")

print("\n--- Trying joblib ---")
try:
    model2 = joblib.load(fert_model_path)
    print("Success with joblib!")
    print(type(model2))
except Exception as e:
    print(f"Failed with joblib: {type(e).__name__} - {e}")
