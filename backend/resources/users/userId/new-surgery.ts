import type { Request, Response } from "express";
import { post, type Resource, type Validators } from "../../lib/resources";
import { checkSchema, matchedData } from "express-validator";
import mongoose from "mongoose";
import { Message } from "../../../common/messages";
import { hasPermission } from "../../lib/access-contorl/abac";
import { HTTP403Error } from "../../../common/errors";
import { Surgery, type ISurgery } from "../../../models/surgery";

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
  surgeries: {
    in: "body",
    isArray: {
      bail: true,
      options: {
        min: 1,
      },
    },
  },
  "surgeries.*.name": {
    in: "body",
    notEmpty: {
      errorMessage: "SURGERIES_REQUIRED",
    },
    trim: true,
  },
  "surgeries.*.date": {
    in: "body",
    notEmpty: {
      errorMessage: Message.DATE_REQUIRED,
    },
    isDate: {
      errorMessage: Message.DATE_INVALID,
    },
  },
});

export const newSurgeries: Resource = post(
  "/users/:userId/surgeries",
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

    req.body.surgeries.forEach(async (element: ISurgery) => {
      element["patient"] = patient;

      if (!hasPermission(req.userContext, "surgeries", "create", element)) throw new HTTP403Error();

      await Surgery.create({ ...element });
    });

    res.empty();
  },
);
