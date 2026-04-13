import joblib
from pathlib import Path

MODEL_DIR = Path("d:/New folder/python_pro/SIH25010/saved_model")
fert_model_path = MODEL_DIR / "xgb_pipeline (3).pkl"

model = joblib.load(fert_model_path)
print("Pipeline keys/attributes:", dir(model))
if hasattr(model, 'classes_'):
    print("Classes:", model.classes_)
for step_name, step_obj in model.steps:
    print("Step:", step_name)
    if hasattr(step_obj, 'classes_'):
        print("Classes from step:", step_obj.classes_)
    if hasattr(step_obj, 'named_steps'):
        print("Nested steps:", step_obj.named_steps)

