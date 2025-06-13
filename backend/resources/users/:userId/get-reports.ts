import type { Request, Response } from "express";
import { get, type Resource, type Validators } from "../../lib/resources";
import { LabReport } from "../../../models/lab-report";
import { checkSchema, matchedData } from "express-validator";
import { Message } from "../../../common/messages";
import type mongoose from "mongoose";

const validators: Validators = checkSchema({
  userId: {
    in: "params",
    isMongoId: {
      errorMessage: Message.NOT_A_MONGOID,
    },
  },
});

export const getReports: Resource = get(
  "/users/:userId/reports",
  {
    auth: true,
    validators,
  },
  async (req: Request, res: Response) => {
    const { userId: patient } = matchedData<{ userId: mongoose.Types.ObjectId }>(req);

    const reports = await LapReport.find({ patient });

    res.success(reports);
  },
);
