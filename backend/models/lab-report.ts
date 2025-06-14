import mongoose, { type Document } from "mongoose";

export interface ITest extends Document {
  testName: string;
  result: string;
  unit?: string;
  referenceRange?: string;
  method?: string;
  conversionFactor?: string;
}

export interface ILabReport extends Document {
  sampleNo: string;
  date: Date;
  specimen: string;
  patient: mongoose.Types.ObjectId;
  tests: ITest;
}

const testSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: [true, "Test name is required"],
    trim: true,
  },
  result: {
    type: String,
    default: "Nil",
    required: [true, "Result is required"],
  },
  unit: {
    type: String,
  },
  referenceRange: {
    type: String,
  },
  method: {
    type: String,
  },
  conversionFactor: {
    type: String,
  },
});

const labReportSchema = new mongoose.Schema(
  {
    sampleNo: {
      type: String,
      required: [true, "Sample No is required"],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: [true, "Report date is required"],
    },
    specimen: {
      type: String,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient ID is required"],
    },
    tests: {
      type: [testSchema],
    },
  },
  {
    timestamps: true,
  },
);

labReportSchema.index({ patient: 1, date: -1 });

export const LabReport = mongoose.model("LabReport", labReportSchema);
