import numpy as np
import pandas as pd
import json
import shutil
from sklearn.linear_model import LogisticRegression

diseases = [
    "Diabetes", "Hypertension", "Coronary_Artery_Disease",
    "Alzheimer", "Parkinson", "Breast_Cancer", "Prostate_Cancer",
    "Colon_Cancer", "Stroke", "Asthma", "COPD", "Osteoporosis",
    "Rheumatoid_Arthritis", "Depression", "Schizophrenia"
]

gp_features = [
    "paternal_grandfather", "paternal_grandmother",
    "maternal_grandfather", "maternal_grandmother",
    "father", "mother"
]
N = 2000
X = np.random.binomial(1, 0.2, size=(N, len(gp_features)))
df = pd.DataFrame(X, columns=gp_features)


model_params = {}

for disease in diseases:
    true_coefs = np.random.uniform(0.3, 1.0, size=4)
    true_intercept = np.random.uniform(-2, -0.5)

    logits = X @ true_coefs + true_intercept
    probs = 1 / (1 + np.exp(-logits))
    y = np.random.binomial(1, probs)

    df[disease] = y 

   
    clf = LogisticRegression(solver="liblinear")
    clf.fit(X, y)

    model_params[disease] = {
        "intercept": float(clf.intercept_[0]),
        "coefs": [float(c) for c in clf.coef_[0]]
    }


model_path = "model.json"
with open(model_path, "w") as f:
    json.dump({"diseases": model_params}, f, indent=2)

df.to_csv("synthetic_hereditary_data.csv", index=False)

try:
    shutil.copy(model_path, "../frontend/assets/model.json")
    print("✔ model.json generated and copied to frontend/assets/")
except FileNotFoundError:
    print("⚠️ frontend/assets/ folder not found. Please create it manually.")


onset_ages = {}
for disease in diseases:
    onset_ages[disease] = np.random.randint(40, 70)

with open(model_path, "w") as f:
    json.dump({
        "diseases": model_params,
        "avg_onset_age": onset_ages
    }, f, indent=2)