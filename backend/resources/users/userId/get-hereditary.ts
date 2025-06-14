import type { Request, Response } from "express";
import { get, type Resource, type Validators } from "../../lib/resources";
import { checkSchema, matchedData } from "express-validator";
import { Message } from "../../../common/messages";
import mongoose from "mongoose";
import { ALL_HEREDITARY_DISEASE_TYPE } from "../../../models/types/hereditary-disease";
import { HereditaryDisease, type IHereditaryDisease } from "../../../models/hereditary-disease";

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
  type: {
    in: "query",
    optional: true,
    trim: true,
    toUpperCase: true,
    isIn: {
      options: [ALL_HEREDITARY_DISEASE_TYPE],
      errorMessage: "HEREDITARY_DISEASE_TYPE_INVALID",
    },
  },
});

export const getHereditaries: Resource = get(
  "/users/:userId/hereditaries",
  {
    auth: true,
    validators,
  },
  async (req: Request, res: Response) => {
    const { userId, type } = matchedData<{ userId: mongoose.Types.ObjectId | "@me"; type: string }>(req);

    let patient: mongoose.Types.ObjectId;
    if (userId === "@me") {
      patient = new mongoose.Types.ObjectId(req.userContext.sub);
    } else {
      patient = new mongoose.Types.ObjectId(userId);
    }

    const query: mongoose.FilterQuery<IHereditaryDisease> = { patient };

    if (type) {
      query["type"] = type;
    }

    const hereditaries = await HereditaryDisease.find(query).lean();

    res.success(hereditaries);
  },
);
