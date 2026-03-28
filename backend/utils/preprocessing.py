from PIL import Image
import numpy as np
import io


def preprocess_image(image_bytes: bytes, target_size=(224, 224)):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize(target_size)

    arr = np.asarray(image).astype("float16")

    # 🔥 CRITICAL FIX → scale to [-1, 1]
    arr = arr / 127.5 - 1.0

    arr = np.expand_dims(arr, axis=0)
    return arr