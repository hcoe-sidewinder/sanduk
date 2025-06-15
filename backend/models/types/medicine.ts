export const ALL_FORMULATION = ["TABLET", "CAPSULE", "LIQUID", "INJECTION"] as const;

type FormulationTuple = typeof ALL_FORMULATION;
export type Formulation = FormulationTuple[number];
