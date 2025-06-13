import type { Request, Response } from "express";
import { post, type Resource, type Validators } from "../../lib/resources";
import { hasPermission } from "../../lib/access-contorl/abac";
import { HTTP403Error } from "../../../common/errors";
import { LabReport, type ILabReport } from "../../../models/lab-report";
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
});

export const newReports: Resource = post(
  "/users/:userId/reports",
  {
    auth: true,
    validators,
  },
  async (req: Request, res: Response) => {
    const { userId } = matchedData<{ userId: mongoose.Types.ObjectId | "@me" }>(req);

    let patient: mongoose.Types.ObjectId;
    if (userId === "@me") {
      patient = req.userContext.sub;
    } else {
      patient = userId;
    }

    req.body.forEach((element: ILabReport) => {
      element["patient"] = patient;

      if (!hasPermission(req.userContext, "labReports", "create", element)) throw new HTTP403Error();

      LabReport.create({ ...element });
    });

    res.empty();
  },
);
