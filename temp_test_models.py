import pickle
import sys
from pathlib import Path

MODEL_DIR = Path("d:/New folder/python_pro/SIH25010/saved_model")
crop_model_path = MODEL_DIR / "crop_recomen (2).pkl"
fert_model_path = MODEL_DIR / "xgb_pipeline (1).pkl"

with open(crop_model_path, "rb") as f:
    crop_model = pickle.load(f)

features_crop_arr = [[90, 42, 43, 20.8, 82.0, 6.5, 202.9]]
try:
    print("Crop predict output type (arr):", type(crop_model.predict(features_crop_arr)[0]))
    print("Crop predict output:", crop_model.predict(features_crop_arr)[0])
except Exception as e:
    print("Error with arr:", e)

with open(fert_model_path, "rb") as f:
    fert_model = pickle.load(f)

# Testing fert with different ordering of label
features_fert_1 = [['rice', 90, 42, 43, 20.8, 82.0, 6.5, 202.9]]
features_fert_2 = [[90, 42, 43, 20.8, 82.0, 6.5, 202.9, 'rice']]

try:
    print("Fert predict output type1:", type(fert_model.predict(features_fert_1)[0]))
    print("Fert predict output1:", fert_model.predict(features_fert_1)[0])
except Exception as e:
    print("Error with fert1:", e)

try:
    print("Fert predict output type2:", type(fert_model.predict(features_fert_2)[0]))
    print("Fert predict output2:", fert_model.predict(features_fert_2)[0])
except Exception as e:
    print("Error with fert2:", e)
