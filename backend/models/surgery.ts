import mongoose, { type Document } from "mongoose";

export interface ISurgery extends Document {
  patient: mongoose.Types.ObjectId;
  name: string;
  date: Date;
}

const surgerySchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient ID is required"],
    },
    name: {
      type: String,
      required: [true, "Surgery name is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Surgery date is required"],
    },
  },
  {
    timestamps: true,
  },
);

surgerySchema.index({ patient: 1, date: -1 });

export const Surgery = mongoose.model("Surgery", surgerySchema);
