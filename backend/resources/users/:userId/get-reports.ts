import type { Request, Response } from "express";
import { get, type Resource, type Validators } from "../../lib/resources";
import { LabReport, type ILabReport } from "../../../models/lab-report";
import { checkSchema, matchedData } from "express-validator";
import { Message } from "../../../common/messages";
import mongoose from "mongoose";
import { Logger } from "../../../common/logger";

const validators: Validators = checkSchema({
  userId: {
    in: "params",
    custom: {
      options: (value: string) => {
        if (value === "@me") {
          return true;
        }
        return mongoose.Types.ObjectId.isValid(value);
      },
      errorMessage: Message.NOT_A_MONGOID_OR_ME,
    },
  },
  testName: {
    in: "query",
    trim: true,
    optional: true,
  },
});

export const getReports: Resource = get(
  "/users/:userId/reports",
  {
    auth: true,
    validators,
  },
  async (req: Request, res: Response) => {
    const { userId, testName } = matchedData<{ userId: mongoose.Types.ObjectId | "@me"; testName: string }>(req);

    let patient: mongoose.Types.ObjectId;
    if (userId === "@me") {
      patient = new mongoose.Types.ObjectId(req.userContext.sub);
    } else {
      patient = new mongoose.Types.ObjectId(userId);
    }

    if (testName) {
      // If testName is provided, use aggregation to get only the desired tests with date
      const pipeline: mongoose.PipelineStage[] = [
        {
          $match: {
            patient,
          },
        },
        {
          $unwind: "$tests", // Deconstruct the 'tests' array
        },
        {
          $match: {
            "tests.testName": testName, // Filter for the specific testName after unwind
          },
        },
        {
          $project: {
            _id: 0, // Exclude the report _id
            date: "$date", // Include the report's date field
            // Correctly access the schema paths for the 'tests' subdocument
            // Mongoose array subdocument schemas are accessed via the 'caster' property.
            // We use 'as any' to bypass strict TypeScript checking for this dynamic access.
            ...(() => {
              const testsPath = LabReport.schema.paths["tests"] as any;
              // Add a check to ensure testsPath, caster, and schema exist,
              // though in a well-defined Mongoose schema, they should.
              if (!testsPath || !testsPath.caster || !testsPath.caster.schema) {
                Logger.error("Error: 'tests' subdocument schema not found or incorrectly defined.");
                // Depending on your error handling strategy, you might want to throw an error
                // or return a specific response here. For now, it will proceed with an empty object
                // which might lead to unexpected project output if this condition is met.
                return {};
              }
              const testSubSchemaPaths = testsPath.caster.schema.paths;
              return Object.fromEntries(Object.keys(testSubSchemaPaths).map((key) => [key, `$tests.${key}`]));
            })(),
          },
        },
      ];

      const filteredTests = await LabReport.aggregate(pipeline);

      return res.success(filteredTests);
    } else {
      // If no testName, return all reports for the patient
      const query: mongoose.FilterQuery<ILabReport> = { patient };
      const reports = await LabReport.find(query).lean();

      res.success(reports);
    }
  },
);
