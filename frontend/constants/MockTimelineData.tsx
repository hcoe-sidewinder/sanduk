export interface HealthEvent {
  date: string;
  type: string;
  description: string;
}

export interface FamilyMember {
  memberId: number;
  name: string;
  events: HealthEvent[];
}

const mockTimelineData: FamilyMember[] = [
  {
    memberId: 1,
    name: "Stuti Upreti",
    events: [
      {
        date: "2023-01-01",
        type: "Checkup",
        description: "General physician checkup",
      },
      {
        date: "2023-03-15",
        type: "Dental",
        description: "Wisdom tooth extraction",
      },
    ],
  },
  {
    memberId: 2,
    name: "Prkriti Shrestha",
    events: [
      { date: "2023-02-10", type: "Vaccination", description: "Flu vaccine" },
      {
        date: "2023-04-20",
        type: "Checkup",
        description: "Annual physical exam",
      },
    ],
  },

  {
    memberId: 3,
    name: "Anshu Gahire",
    events: [
      { date: "2023-02-10", type: "Vaccination", description: "Flu vaccine" },
      {
        date: "2023-04-20",
        type: "Checkup",
        description: "Annual physical exam",
      },
    ],
  },
  {
    memberId: 4,
    name: "Amrit Chapai",
    events: [
      { date: "2023-02-10", type: "Vaccination", description: "Flu vaccine" },
      {
        date: "2023-04-20",
        type: "Checkup",
        description: "Annual physical exam",
      },
    ],
  },
  {
    memberId: 5,
    name: "Kukku Pandey",
    events: [
      { date: "2023-02-10", type: "Vaccination", description: "Flu vaccine" },
      {
        date: "2023-12-20",
        type: "Checkup",
        description: "Annual physical exam",
      },
      {
        date: "2024-1-20",
        type: "Checkup",
        description: "Annual physical exam",
      },
    ],
  },
];

export default mockTimelineData;
