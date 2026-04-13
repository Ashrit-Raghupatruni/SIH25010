#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import imblearn
from imblearn.over_sampling import SMOTE
from collections import Counter

from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split

from sklearn.neighbors import  KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
import xgboost
from xgboost import XGBClassifier

from sklearn.metrics import accuracy_score, confusion_matrix
import pickle

import warnings
warnings.filterwarnings("ignore")

# get_ipython().run_line_magic('matplotlib', 'inline')


# In[ ]:


import pandas as pd

# Login using e.g. `huggingface-cli login` to access this dataset
df = pd.read_csv("hf://datasets/Jakehills/Crop_Yield_Fertilizer/Crop_Yield_Fertilizer.csv")


# In[ ]:


df.head()


# In[ ]:


import joblib
from sklearn.preprocessing import LabelEncoder

label_encoder=LabelEncoder()
df['label']=label_encoder.fit_transform(df['label'])

fert_encoder=LabelEncoder()
df['fertilizer']=fert_encoder.fit_transform(df['fertilizer'])

# Create fertname_dict from the fert_encoder
fertname_dict_new = {}
for i in range(len(fert_encoder.classes_)):
    fertname_dict_new[i] = fert_encoder.inverse_transform([i])[0]

# Save the new fertname_dict.pkl
joblib.dump(fertname_dict_new, "fertname_dict.pkl")
print("New fertname_dict.pkl saved successfully!")


# In[ ]:





# In[ ]:


X=df[df.columns[:-1]].drop(['yield'],axis=1)
y=df[df.columns[-1]]


# In[ ]:


from sklearn.model_selection import train_test_split
x_train,x_test,y_train,y_test=train_test_split(X,y,test_size=0.2,random_state=42)


# In[ ]:


xgb_pipeline = make_pipeline(StandardScaler(), XGBClassifier(random_state = 18))
xgb_pipeline.fit(x_train, y_train)


# In[ ]:


xgb_pipeline = make_pipeline(StandardScaler(), XGBClassifier(random_state = 18))
xgb_pipeline.fit(x_train, y_train)

# Accuray On Test Data
predictions = xgb_pipeline.predict(x_test)
accuracy = accuracy_score(y_test, predictions)
print(f"Accuracy on Test Data: {accuracy*100}%")
plt.figure(figsize = (15,9))
sns.heatmap(confusion_matrix(y_test, predictions), annot = True)
plt.title("Confusion Matrix for Test Data")
# plt.show()

print()

# Accuray On Whole Data
predictions = xgb_pipeline.predict(X.values)
accuracy = accuracy_score(y, predictions)
print(f"Accuracy on Whole Data: {accuracy*100}%")
plt.figure(figsize = (15,9))
sns.heatmap(confusion_matrix(y, predictions), annot = True)
plt.title("Confusion Matrix for Whole Data")
# plt.show()


# In[ ]:


# X1 = df2[df2.columns[:-1]]
# y2 = df2[df2.columns[-1]]


# In[ ]:


import joblib

joblib.dump(xgb_pipeline, "xgb_pipeline.pkl")


# In[ ]:


# from google.colab import files
# files.download("fertname_dict.pkl")


# In[ ]:


import joblib
import numpy as np

xgb_pipeline_loaded = joblib.load("xgb_pipeline.pkl")
fertname_dict_loaded = joblib.load("fertname_dict.pkl")


# In[ ]:


import joblib
import numpy as np

xgb_pipeline_loaded = joblib.load("xgb_pipeline.pkl")
fertname_dict_loaded = joblib.load("fertname_dict.pkl")

print("XGBoost model and fertilizer dictionary loaded successfully!")


# In[ ]:


import joblib

joblib.dump(xgb_pipeline, "xgb_pipeline.pkl")


# In[ ]:





# In[ ]:


import joblib
import numpy as np

# Load the saved models and dictionaries
# xgb_pipeline_loaded = joblib.load("xgb_pipeline.pkl")
# fertname_dict_loaded = joblib.load("fertname_dict.pkl")
# croptype_dict_loaded = joblib.load("croptype_dict.pkl")
# soiltype_dict_loaded = joblib.load("soiltype_dict.pkl")

print("XGBoost model and dictionaries loaded successfully!")

