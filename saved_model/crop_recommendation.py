# !pip install xgboost

import kagglehub

# Download latest version
path = kagglehub.dataset_download("atharvaingle/crop-recommendation-dataset")

print("Path to dataset files:", path)

import pandas as pd
import numpy as np
df = pd.read_csv(path + "/Crop_recommendation.csv")
df.isna().sum()


df['label'].unique()

df.tail()

X=df.drop('label',axis=1)
Y=df['label']

from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import cross_validate

le = LabelEncoder()
Y_encoded = le.fit_transform(Y)
model = XGBClassifier()
x_train,x_test,y_train_encoded,y_test_encoded=train_test_split(X,Y_encoded,test_size=0.2,random_state=42)
model.fit(x_train,y_train_encoded)
y_pred_encoded=model.predict(x_test)
accuracy=accuracy_score(y_test_encoded,y_pred_encoded)
print(accuracy)

from sklearn.model_selection import cross_val_score,KFold
kfold = KFold(n_splits=5, shuffle=True, random_state=42)
score=cross_val_score(model,X,Y_encoded,cv=kfold)
print(score)

sample_data = pd.DataFrame({
    'N': [90],
    'P': [42],
    'K': [43],
    'temperature': [20.87],
    'humidity': [82.00],
    'ph': [6.50],
    'rainfall': [202.93]
})
sample_pred_encoded = model.predict(sample_data)
sample_pred_label = le.inverse_transform(sample_pred_encoded)

print(f"The predicted crop for the sample data is: {sample_pred_label[0]}")


from xgboost import plot_importance
import matplotlib.pyplot as plt

plot_importance(model)
# plt.show()

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV
param_grid_xgb = {
    'n_estimators': [100, 200, 300],
    'learning_rate': [0.01, 0.1, 0.2],
    'max_depth': [3, 5, 7]
}
grid_search_xgb = GridSearchCV(estimator=XGBClassifier(random_state=42),
                               param_grid=param_grid_xgb,
                               cv=5,
                               scoring='accuracy',
                               n_jobs=-1,
                               verbose=1)

print("Performing GridSearchCV for XGBoost...")
grid_search_xgb.fit(x_train, y_train_encoded)

print("\nXGBoost Best Parameters:", grid_search_xgb.best_params_)
print("XGBoost Best Score:", grid_search_xgb.best_score_)
param_grid_rf = {
    'n_estimators': [100, 200, 300],
    'max_depth': [5, 10, None],
    'min_samples_split': [2, 5, 10]
}
grid_search_rf = GridSearchCV(estimator=RandomForestClassifier(random_state=42),
                              param_grid=param_grid_rf,
                              cv=5,
                              scoring='accuracy',
                              n_jobs=-1,
                              verbose=1)

print("\nPerforming GridSearchCV for Random Forest...")
grid_search_rf.fit(x_train, y_train_encoded)

print("\nRandom Forest Best Parameters:", grid_search_rf.best_params_)
print("Random Forest Best Score:", grid_search_rf.best_score_)

best_xgb = grid_search_xgb.best_estimator_
best_rf  = grid_search_rf.best_estimator_
from sklearn.metrics import accuracy_score

xgb_pred = best_xgb.predict(x_test)
rf_pred  = best_rf.predict(x_test)

print("XGB Test Accuracy:", accuracy_score(y_test_encoded, xgb_pred))
print("RF Test Accuracy :", accuracy_score(y_test_encoded, rf_pred))

from sklearn.metrics import confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt

# The error occurs because df['label'] contains string labels,
# while y_test_encoded and y_pred_encoded contain integer labels.
# The confusion_matrix function expects consistent label types.
# Removing the 'labels' argument allows it to infer integer labels.
cm = confusion_matrix(y_test_encoded, rf_pred)

# To make the heatmap readable with original crop names,
# use le.classes_ for xticklabels and yticklabels in seaborn.heatmap
plt.figure(figsize=(12, 10)) # Adjust figure size for better display of many labels
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=le.classes_, yticklabels=le.classes_)
plt.ylabel('Actual')
plt.xlabel('Predicted')
plt.title('Confusion Matrix')
# plt.show()

from sklearn.metrics import classification_report
print(classification_report(y_test_encoded,y_pred_encoded))

import joblib
joblib.dump(grid_search_rf.best_estimator_,"crop_recomen.pkl")

# from google.colab import files
# files.download('crop_recomen.pkl')
