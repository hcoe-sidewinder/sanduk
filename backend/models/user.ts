import mongoose, { type Document } from "mongoose";
import {
  Sex,
  ALL_SEX,
  Bloodtype,
  ALL_BLOOD_TYPE,
  Role,
  ALL_ROLE,
  RelationToFamilyAdmin,
  ALL_RELATION_TO_FAMILY_ADMIN,
} from "./types/user";

// Define an interface for the User document to provide type safety
export interface IUser extends Document {
  nidNo: string;
  nidImg: string;
  password: string;
  dob: Date;
  sex: Sex;
  name: string;
  bloodtype: Bloodtype;
  role?: Role;
  isDoctor?: boolean;
  doctorDetails?: {
    specialty: string;
    licenseNumber: string;
    clinicAddress: string;
  };
  familyAdmin?: mongoose.Types.ObjectId;
  relationToFamilyAdmin?: RelationToFamilyAdmin;
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
      enum: ALL_SEX,
      required: [true, "Sex is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    bloodtype: {
      type: String,
      enum: ALL_BLOOD_TYPE,
      required: [true, "Blood type is required"],
    },
    role: {
      type: String,
      enum: ALL_ROLE,
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
    relationToFamilyAdmin: {
      type: String,
      enum: ALL_RELATION_TO_FAMILY_ADMIN,
      required: function (this: IUser) {
        return this.role === "MEMBER";
      },
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
