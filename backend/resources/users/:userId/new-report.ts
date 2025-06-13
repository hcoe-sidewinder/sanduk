import type { Request, Response } from "express";
import { post, type Resource, type Validators } from "../../lib/resources";
import { hasPermission } from "../../lib/access-contorl/abac";
import { HTTP403Error } from "../../../common/errors";
import { LabReport, type ILabReport } from "../../../models/lab-report";
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

export const newReports: Resource = post(
  "/users/:userId/reports",
  {
    auth: true,
    validators,
  },
  async (req: Request, res: Response) => {
    const { userId: patient } = matchedData<{ userId: mongoose.Types.ObjectId }>(req);

    req.body.forEach((element: ILabReport) => {
      element["patient"] = patient;

      if (!hasPermission(req.userContext, "labReports", "create", element)) throw new HTTP403Error();

      LapReport.create({ ...element });
    });

    res.empty();
  },
);
