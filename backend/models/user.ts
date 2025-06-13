import mongoose, { type Document } from "mongoose";

// Define an interface for the User document to provide type safety
export interface IUser extends Document {
  nidNo: string;
  nidImg: string;
  password: string;
  dob: Date;
  sex: "MALE" | "FEMALE" | "OTHER";
  name: string;
  bloodtype: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  role: "FAMILY_ADMIN" | "MEMBER";
  isDoctor: boolean;
  doctorDetails?: {
    specialty: string;
    licenseNumber: string;
    clinicAddress: string;
  };
  familyAdmin?: mongoose.Types.ObjectId;
  relationshipToFamilyAdmin?:
    | "FATHER"
    | "MOTHER"
    | "SON"
    | "DAUGHTER"
    | "BROTHER"
    | "SISTER"
    | "PARTNER"
    | "GRANDFATHER"
    | "GRANDMOTHER"
    | "GRANDSON"
    | "GRANDDAUGHTER"
    | "GREATGRANDFATHER"
    | "GREATGRANDMOTHER";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    nidNo: {
      type: String,
      required: [true, "National ID Number is required"],
      unique: true,
      trim: true,
      index: true,
    },
    nidImg: {
      type: String,
      required: [true, "National ID Image URL is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    dob: {
      type: Date,
      required: [true, "Date of Birth is required"],
    },
    sex: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
      required: [true, "Sex is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    bloodtype: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: [true, "Blood type is required"],
    },
    role: {
      type: String,
      enum: ["FAMILY_ADMIN", "MEMBER"],
      default: "MEMBER",
      required: [true, "User role is required"],
    },
    isDoctor: {
      type: Boolean,
      default: false,
    },
    doctorDetails: {
      specialty: {
        type: String,
        required: function (this: IUser) {
          return this.isDoctor;
        },
      },
      licenseNumber: {
        type: String,
        required: function (this: IUser) {
          return this.isDoctor;
        },
        unique: function (this: IUser) {
          return this.isDoctor;
        }, // License numbers should be unique for doctors
        trim: true,
      },
      clinicAddress: {
        type: String,
        required: function (this: IUser) {
          return this.isDoctor;
        }, // Type 'this'
      },
    },
    familyAdmin: {
      // This field will store the ObjectId of the FAMILY_ADMIN user who manages this member
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function (this: IUser) {
        return this.role === "MEMBER";
      },
    },
    relationshipToFamilyAdmin: {
      type: String,
      enum: [
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
      ],
      required: function (this: IUser) {
        return this.role === "MEMBER";
      },
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
