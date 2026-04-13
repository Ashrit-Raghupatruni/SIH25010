import pickle
from pathlib import Path

path = Path("d:/New folder/python_pro/SIH25010/saved_model/fertname_dict.pkl")
with open(path, "rb") as f:
    fert_dict = pickle.load(f)
print(fert_dict)
