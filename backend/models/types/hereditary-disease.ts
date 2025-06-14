export const ALL_HEREDITARY_DISEASE_TYPE = [
  "ALZHEIMER",
  "ASTHMA",
  "BREAST_CANCER",
  "COLON_CANCER",
  "COPD",
  "CORONARY_ARTERY_DISEASE",
  "DEPRESSION",
  "DIABETES",
  "HYPERTENSION",
  "OSTEOPOROSIS",
  "PARKINSON",
  "PROSTATE_CANCER",
  "RHEUMATOID_ARTHRITIS",
  "SCHIZOPHRENIA",
  "STROKE",
] as const;

type HereditaryDiseaseTypeTuple = typeof ALL_HEREDITARY_DISEASE_TYPE;
export type HereditaryDiseaseType = HereditaryDiseaseTypeTuple[number];
