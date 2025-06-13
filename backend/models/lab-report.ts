import mongoose, { type Document } from "mongoose";

export interface ILabReport extends Document {
  patient: mongoose.Types.ObjectId;
  testName: string;
  result: string;
  date: Date;
}

const labReportSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient ID is required"],
    },
    testName: {
      type: String,
      required: [true, "Test name is required"],
      trim: true,
    },
    result: {
      type: String,
      required: [true, "Result is required"],
    },
    date: {
      type: Date,
      default: Date.now,
      required: [true, "Report date is required"],
    },
  },
  {
    timestamps: true,
  },
);

labReportSchema.index({ patient: 1, date: -1 });

export const LapReport = mongoose.model("LabReport", labReportSchema);
