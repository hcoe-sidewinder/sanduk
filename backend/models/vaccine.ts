import mongoose, { type Document } from "mongoose";

export interface IVaccine extends Document {
  patient: mongoose.Types.ObjectId;
  name: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const vaccineSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient ID is required"],
    },
    name: {
      type: String,
      required: [true, "Vaccine name is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Vaccination date is required"],
    },
  },
  {
    timestamps: true,
  },
);

vaccineSchema.index({ patient: 1, date: -1 });

export const Vaccine = mongoose.model("Vaccine", vaccineSchema);
