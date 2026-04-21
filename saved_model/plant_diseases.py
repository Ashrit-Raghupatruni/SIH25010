import os
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models, Sequential
from tensorflow.keras.applications import MobileNetV2
from datasets import load_dataset
import matplotlib.pyplot as plt

# TO RUN IN COLAB:
# !pip install datasets huggingface-hub

# ------------- Configuration -------------
INPUT_SHAPE = (224, 224, 3)
BATCH_SIZE = 32
EPOCHS = 10
MODEL_SAVE_PATH = "plant_saved_model_tf"
CLASS_NAMES_FILE = "class_names.txt"

# ------------- Dataset Loading & Balancing -------------
class DatasetManager:
    def __init__(self, dataset_name="Hemg/new-plant-diseases-dataset"):
        self.dataset_name = dataset_name
        self.ds = None
        self.class_names = []
        self.num_classes = 0

    def load_and_preprocess(self):
        print(f"Loading dataset: {self.dataset_name}...")
        # Load the dataset
        self.ds = load_dataset(self.dataset_name)
        
        # Get class names from features
        self.class_names = self.ds['train'].features['label'].names
        self.num_classes = len(self.class_names)
        
        # Save class names for the backend
        with open(CLASS_NAMES_FILE, "w") as f:
            for name in self.class_names:
                f.write(f"{name}\n")
        print(f"Saved {self.num_classes} classes to {CLASS_NAMES_FILE}")
        
        return self.ds

    def balance_dataset(self, split='train'):
        """Balances the dataset using upsampling."""
        labels = self.ds[split]['label']
        label_counts = np.bincount(labels)
        max_count = np.max(label_counts)
        
        print(f"Original distribution for {split}: {dict(enumerate(label_counts))}")
        
        balanced_indices = []
        for i in range(self.num_classes):
            indices = np.where(np.array(labels) == i)[0]
            # Upsample by repeating indices
            repeats = int(np.ceil(max_count / len(indices)))
            upsampled_indices = np.tile(indices, repeats)[:max_count]
            balanced_indices.extend(upsampled_indices)
            
        print(f"Balanced distribution for {split}: {len(balanced_indices)} images total ({max_count} per class)")
        return self.ds[split].select(balanced_indices)

def preprocess_fn(examples):
    """Processes images for the model."""
    images = []
    for img in examples['image']:
        # Ensure image is RGB and resized
        img = img.convert("RGB").resize((224, 224))
        images.append(np.array(img))
    
    examples['pixel_values'] = images
    return examples

# ------------- Model Builder -------------
class PlantModelBuilder:
    def __init__(self, num_classes):
        self.num_classes = num_classes

    def build_mobilenet_v2(self):
        # Base model with pre-trained ImageNet weights
        base_model = MobileNetV2(
            input_shape=INPUT_SHAPE,
            include_top=False,
            weights='imagenet'
        )
        base_model.trainable = False  # Freeze the base

        model = Sequential([
            # Data Augmentation (Runs on GPU during training)
            layers.Input(shape=INPUT_SHAPE),
            layers.RandomFlip("horizontal_and_vertical"),
            layers.RandomRotation(0.2),
            layers.RandomZoom(0.2),
            
            # Rescaling (MobileNetV2 expects -1 to 1)
            layers.Rescaling(1./127.5, offset=-1),
            
            base_model,
            layers.GlobalAveragePooling2D(),
            layers.BatchNormalization(),
            layers.Dense(256, activation='relu'),
            layers.Dropout(0.4),
            layers.Dense(self.num_classes, activation='softmax')
        ])

        model.compile(
            optimizer='adam',
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        return model

# ------------- Main execution for Colab -------------
if __name__ == "__main__":
    # 1. Load Data
    manager = DatasetManager()
    dataset = manager.load_and_preprocess()
    
    # 2. Balance Training and Validation
    train_balanced = manager.balance_dataset('train')
    # Note: Use a subset for validation if needed, or the original val split
    val_ds = dataset['validation'] if 'validation' in dataset else dataset['train'].select(range(500)) 

    # 3. Create TF Datasets (Efficient Pipeline)
    def generator_fn(hf_dataset):
        for item in hf_dataset:
            # Preprocess image on the fly
            img = item['image'].convert("RGB").resize((224, 224))
            yield np.array(img), item['label']

    train_tf = tf.data.Dataset.from_generator(
        lambda: generator_fn(train_balanced),
        output_signature=(
            tf.TensorSpec(shape=(224, 224, 3), dtype=tf.uint8),
            tf.TensorSpec(shape=(), dtype=tf.int32)
        )
    ).batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)

    val_tf = tf.data.Dataset.from_generator(
        lambda: generator_fn(val_ds),
        output_signature=(
            tf.TensorSpec(shape=(224, 224, 3), dtype=tf.uint8),
            tf.TensorSpec(shape=(), dtype=tf.int32)
        )
    ).batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)

    # 4. Build and Train
    builder = PlantModelBuilder(manager.num_classes)
    model = builder.build_mobilenet_v2()
    
    print("Starting training...")
    history = model.fit(
        train_tf,
        validation_data=val_tf,
        epochs=EPOCHS,
        callbacks=[
            tf.keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True)
        ]
    )

    # 5. Save the final model for the backend
    # We save in SavedModel format because the backend expects a directory
    model.save(MODEL_SAVE_PATH)
    print(f"Model saved to {MODEL_SAVE_PATH}")
    
    # Optional: Plot results
    plt.plot(history.history['accuracy'], label='accuracy')
    plt.plot(history.history['val_accuracy'], label = 'val_accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend(loc='lower right')
    plt.show()