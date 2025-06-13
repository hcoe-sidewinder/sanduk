import type { Request, Response } from "express";
import { get, type Resource, type Validators } from "../../lib/resources";
import { LabReport } from "../../../models/lab-report";
import { checkSchema, matchedData } from "express-validator";
import { Message } from "../../../common/messages";
import mongoose from "mongoose";

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
      patient = req.userContext.sub;
    } else {
      patient = userId;
    }

    const query: mongoose.FilterQuery<typeof LabReport> = { patient };

    if (testName) {
      query["testName"] = testName;
    }

    const reports = await LabReport.find(query);

    res.success(reports);
  },
);
