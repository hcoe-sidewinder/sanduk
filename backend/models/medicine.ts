import mongoose from "mongoose";
import { ALL_FORMULATION } from "./types/medicine";

const medicin = new mongoose.Schema({
  // https://vwani.co.ke/prescription-writing-key-elements-abbreviations-and-best-practices-for-healthcare-professionals/
  formulation: {
    type: String,
    enum: ALL_FORMULATION,
    required: [true, "Name is required"],
    trim: true,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  strength: {
    type: String,
    required: [true, "Strength is required"],
    trim: true,
  },
  frequency: {
    type: String,
    required: [true, "Frequency is required"],
    trim: true,
  },
  duration: {
    type: String,
    required: [true, "Duration is required"],
    trim: true,
  },
});

const medicineSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Paitent is required"],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor is required"],
    },
    medicines: {
      type: [medicin],
    },
  },
  { timestamps: true },
);

medicineSchema.index({ createdAt: -1 });

export const Medicine = mongoose.model("Medicine", medicineSchema);
