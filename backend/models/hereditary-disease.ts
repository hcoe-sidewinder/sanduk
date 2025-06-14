import mongoose from "mongoose";
import { ALL_HEREDITARY_DISEASE_TYPE, type HereditaryDiseaseType } from "./types/hereditary-disease";

export interface IHereditaryDisease extends Document {
  patient: mongoose.Types.ObjectId;
  type: HereditaryDiseaseType;
  onSetAge: number;
}

const hereditaryDiseaseSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient ID is required"],
    },
    type: {
      type: String,
      enum: ALL_HEREDITARY_DISEASE_TYPE,
      required: [true, "Disease name is required"],
      trim: true,
      unique: true,
    },
    onSetAge: {
      type: Number,
      require: [true, "On Set Age is required"],
    },
  },
  {
    timestamps: true,
  },
);

export const HereditaryDisease = mongoose.model("HereditaryDisease", hereditaryDiseaseSchema);
