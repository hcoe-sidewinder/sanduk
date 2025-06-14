export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export type Model = Record<string, { intercept: number; coefs: number[] }>;

export function predictDiseaseRisk(
  model: { diseases: Model },
  inputs: number[]
): Record<string, { risk: number }> {
  const out: Record<string, { risk: number }> = {};
  for (const [disease, { intercept, coefs }] of Object.entries(
    model.diseases
  )) {
    let logit = intercept;
    coefs.forEach((c, i) => (logit += c * inputs[i]));
    const percent = Math.round(sigmoid(logit) * 100 * 100) / 100; // percent with 2 decimals
    out[disease] = { risk: percent };
  }
  return out;
}

export const sampleModel: { diseases: Model } = {
  diseases: Object.fromEntries(
    [
      "diabetes",
      "hypertension",
      "heart_disease",
      "asthma",
      "cancer",
      "arthritis",
      "alzheimer",
      "stroke",
      "kidney_disease",
      "depression",
      "obesity",
      "parkinsons",
      "autoimmune_disease",
    ].map((disease) => [
      disease,
      {
        intercept: Math.random() * -2,
        coefs: Array(6)
          .fill(0)
          .map(() => Math.random() * 2 - 1),
      },
    ])
  ),
};
