export const ALL_SEX = ["MALE", "FEMALE", "OTHER"] as const;

type SexTuple = typeof ALL_SEX;
export type Sex = SexTuple[number];

export const ALL_BLOOD_TYPE = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

type BloodtypeTuple = typeof ALL_BLOOD_TYPE;
export type Bloodtype = BloodtypeTuple[number];

export const ALL_ROLE = ["FAMILY_ADMIN", "MEMBER"] as const;

type RoleTuple = typeof ALL_ROLE;
export type Role = RoleTuple[number];

export const ALL_RELATION_TO_FAMILY_ADMIN = [
  "FATHER",
  "MOTHER",
  "SON",
  "DAUGHTER",
  "BROTHER",
  "SISTER",
  "PARTNER",
  "GRANDFATHER",
  "GRANDMOTHER",
  "GRANDSON",
  "GRANDDAUGHTER",
  "GREATGRANDFATHER",
  "GREATGRANDMOTHER",
] as const;

type RelationToFamilyAdminTuple = typeof ALL_RELATION_TO_FAMILY_ADMIN;
export type RelationToFamilyAdmin = RelationToFamilyAdminTuple[number];
