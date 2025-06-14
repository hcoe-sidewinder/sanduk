// Math sigmoid function
export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

// Types
export type DiseaseModel = {
  intercept: number;
  coefs: number[];
};

export type Model = {
  diseases: Record<string, DiseaseModel>;
  avg_onset_age?: Record<string, number>;
};

// Sample model data for 13 diseases
export const sampleModel: Model = {
  diseases: {
    diabetes: { intercept: -1.2, coefs: [0.9, 0.8, 1.0, 0.7, 0.85, 0.75] },
    cancer: { intercept: -0.5, coefs: [1.1, 1.2, 0.9, 0.6, 1.0, 0.9] },
    hypertension: { intercept: -0.8, coefs: [0.7, 0.9, 1.2, 1.0, 0.95, 0.8] },
    coronary_artery_disease: {
      intercept: -1.2,
      coefs: [0.9, 0.8, 1.0, 0.7, 0.85, 0.75],
    },
    Alzheimer: { intercept: -0.5, coefs: [1.1, 1.2, 0.9, 0.6, 1.0, 0.9] },
    Parkinson: { intercept: -0.8, coefs: [0.7, 0.9, 1.2, 1.0, 0.95, 0.8] },
    Breast_Cancer: { intercept: -1.2, coefs: [0.9, 0.8, 1.0, 0.7, 0.85, 0.75] },
    Colon_Cancer: { intercept: -0.5, coefs: [1.1, 1.2, 0.9, 0.6, 1.0, 0.9] },
    Stroke: { intercept: -0.8, coefs: [0.7, 0.9, 1.2, 1.0, 0.95, 0.8] },
    Asthma: { intercept: -1.2, coefs: [0.9, 0.8, 1.0, 0.7, 0.85, 0.75] },
    COPD: { intercept: -0.5, coefs: [1.1, 1.2, 0.9, 0.6, 1.0, 0.9] },
    Osteoporosis: { intercept: -0.8, coefs: [0.7, 0.9, 1.2, 1.0, 0.95, 0.8] },
    Depression: { intercept: -0.5, coefs: [1.1, 1.2, 0.9, 0.6, 1.0, 0.9] },
    Schizophrenia: { intercept: -0.8, coefs: [0.7, 0.9, 1.2, 1.0, 0.95, 0.8] },
  },

  avg_onset_age: {
    diabetes: 50,
    cancer: 60,
    hypertension: 55,
  },
};

/**
 * Predict disease risk from a single disease model and user input vector.
 * @param model - Subset of sampleModel with one disease
 * @param inputs - Array of 0/1 values for family history
 * @returns Object with risk and optional onsetAge
 */
export function predictDiseaseRisk(
  model: Partial<Model>,
  inputs: number[]
): { [disease: string]: { risk: number; onsetAge?: number } } {
  const out: Record<string, { risk: number; onsetAge?: number }> = {};

  for (const [disease, { intercept, coefs }] of Object.entries(
    model.diseases || {}
  )) {
    if (inputs.length !== coefs.length) {
      throw new Error(
        `Input length (${inputs.length}) does not match number of coefficients (${coefs.length}) for disease ${disease}`
      );
    }

    let logit = intercept;
    coefs.forEach((coef, idx) => {
      logit += coef * inputs[idx];
    });

    const risk = Math.round(sigmoid(logit) * 100 * 100) / 100; // 2 decimal %

    out[disease] = {
      risk,
      onsetAge: model.avg_onset_age?.[disease],
    };
  }

  return out;
}
