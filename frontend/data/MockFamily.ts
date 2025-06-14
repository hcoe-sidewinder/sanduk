export const ALL_DISEASES = [
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
] as const;

export type Disease = (typeof ALL_DISEASES)[number];

export type FamilyMember = {
  id: string;
  name: string;
  relation: string;
  emoji: string;
  gender: "male" | "female";
  conditions: Disease[];
  ageOfOnset: Partial<Record<Disease, number>>;
  position: { x: number; y: number };
  color: string;
};

export const mockFamilyData: FamilyMember[] = [
  {
    id: "maternal_grandfather",
    name: "Robert",
    relation: "Maternal Grandfather",
    emoji: "👴",
    gender: "male",
    conditions: ["diabetes", "arthritis"],
    ageOfOnset: { diabetes: 65, arthritis: 72 },
    position: { x: 0.15, y: 0.1 },
    color: "#4a90e2",
  },
  {
    id: "maternal_grandmother",
    name: "Mary",
    relation: "Maternal Grandmother",
    emoji: "👵",
    gender: "female",
    conditions: ["hypertension", "alzheimer"],
    ageOfOnset: { hypertension: 60, alzheimer: 75 },
    position: { x: 0.35, y: 0.1 },
    color: "#e24a90",
  },
  {
    id: "paternal_grandfather",
    name: "William",
    relation: "Paternal Grandfather",
    emoji: "👴",
    gender: "male",
    conditions: ["heart_disease", "stroke", "kidney_disease"],
    ageOfOnset: { heart_disease: 58, stroke: 64, kidney_disease: 70 },
    position: { x: 0.65, y: 0.1 },
    color: "#4a90e2",
  },
  {
    id: "paternal_grandmother",
    name: "Elizabeth",
    relation: "Paternal Grandmother",
    emoji: "👵",
    gender: "female",
    conditions: ["cancer", "asthma"],
    ageOfOnset: { cancer: 62, asthma: 45 },
    position: { x: 0.85, y: 0.1 },
    color: "#e24a90",
  },
  {
    id: "father",
    name: "John",
    relation: "Father",
    emoji: "👨",
    gender: "male",
    conditions: ["diabetes", "obesity", "depression"],
    ageOfOnset: { diabetes: 50, obesity: 40, depression: 30 },
    position: { x: 0.3, y: 0.4 },
    color: "#4a90e2",
  },
  {
    id: "mother",
    name: "Sarah",
    relation: "Mother",
    emoji: "👩",
    gender: "female",
    conditions: ["hypertension", "autoimmune_disease", "cancer"],
    ageOfOnset: {
      hypertension: 47,
      autoimmune_disease: 38,
      cancer: 52,
    },
    position: { x: 0.7, y: 0.4 },
    color: "#e24a90",
  },
];
