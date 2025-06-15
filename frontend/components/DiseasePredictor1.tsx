export type FamilyHistory = {
  grandparents: Record<string, number>;
  parents: Record<string, number>;
  user: Record<string, number>;
};

export const predictRisk = (history: FamilyHistory) => {
  const diseases = Object.keys(history.user);
  const prediction: Record<string, number> = {};

  for (const disease of diseases) {
    const score =
      (history.grandparents[disease] || 0) * 1 +
      (history.parents[disease] || 0) * 2 +
      (history.user[disease] || 0) * 3;

    const percentage = Math.round((score / 6) * 100);
    prediction[disease] = percentage;
  }

  return prediction;
};
