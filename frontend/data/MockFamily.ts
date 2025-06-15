export const ALL_DISEASES = [
  "heart_disease",
  "diabetes",
  "cancer",
  "hypertension",
  "alzheimers",
  "stroke",
  "arthritis",
  "osteoporosis",
  "kidney_disease",
  "depression",
  "obesity",
  "kidney_disease",
  "parkinsons",
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
    name: "Ram Krishna Aryal",
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
    name: "Sita Aryal",
    relation: "Maternal Grandmother",
    emoji: "👵",
    gender: "female",
    conditions: ["hypertension", "alzheimers"],
    ageOfOnset: { hypertension: 60, alzheimers: 75 },
    position: { x: 0.35, y: 0.1 },
    color: "#e24a90",
  },
  {
    id: "paternal_grandfather",
    name: "Shree Nath Pandey",
    relation: "Paternal Grandfather",
    emoji: "👴",
    gender: "male",
    conditions: ["heart_disease", "parkinsons", "kidney_disease"],
    ageOfOnset: {
      heart_disease: 58,
      stroke: 64,
      obesity: 40,
      kidney_disease: 70,
    },
    position: { x: 0.65, y: 0.1 },
    color: "#4a90e2",
  },
  {
    id: "paternal_grandmother",
    name: "Leela Kumari Pandey",
    relation: "Paternal Grandmother",
    emoji: "👵",
    gender: "female",
    conditions: ["cancer", "diabetes"],
    ageOfOnset: { cancer: 62, diabetes: 45 },
    position: { x: 0.85, y: 0.1 },
    color: "#e24a90",
  },
  {
    id: "father",
    name: "Jagdish Aryal",
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
    name: "Sara Aryal",
    relation: "Mother",
    emoji: "👩",
    gender: "female",
    conditions: ["hypertension", "osteoporosis", "cancer"],
    ageOfOnset: {
      hypertension: 47,
      osteoporosis: 38,
      cancer: 52,
    },
    position: { x: 0.7, y: 0.4 },
    color: "#e24a90",
  },
];
