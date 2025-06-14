import type { Request, Response } from "express";
import { post, type Resource, type Validators } from "../../lib/resources";
import { checkSchema, matchedData } from "express-validator";
import mongoose from "mongoose";
import { Message } from "../../../common/messages";
import { hasPermission } from "../../lib/access-contorl/abac";
import { HTTP403Error } from "../../../common/errors";
import { HereditaryDisease, type IHereditaryDisease } from "../../../models/hereditary-disease";
import { ALL_HEREDITARY_DISEASE_TYPE } from "../../../models/types/hereditary-disease";

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
  hereditaries: {
    in: "body",
    isArray: {
      bail: true,
      options: {
        min: 1,
      },
    },
  },
  "hereditaries.*.type": {
    in: "body",
    notEmpty: {
      errorMessage: "HEREDITARY_TYPE_REQUIRED",
    },
    trim: true,
    toUpperCase: true,
    isIn: {
      options: [ALL_HEREDITARY_DISEASE_TYPE],
      errorMessage: "HEREDITARY_TYPE_INVALID",
    },
  },
  "hereditaries.*.onSetAge": {
    in: "body",
    notEmpty: {
      errorMessage: "ON_SET_AGE_REQUIRED",
    },
    isInt: {
      errorMessage: "ON_SET_AGE_INVALID",
    },
  },
});

export const newHereditaries: Resource = post(
  "/users/:userId/hereditaries",
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

    req.body.hereditaries.forEach(async (element: IHereditaryDisease) => {
      element["patient"] = patient;

      if (!hasPermission(req.userContext, "hereditaries", "create", element)) throw new HTTP403Error();

      await HereditaryDisease.create({ ...element });
    });

    res.empty();
  },
);
