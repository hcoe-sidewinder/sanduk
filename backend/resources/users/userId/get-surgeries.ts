import type { Request, Response } from "express";
import { get, type Resource, type Validators } from "../../lib/resources";
import { checkSchema, matchedData } from "express-validator";
import { Message } from "../../../common/messages";
import mongoose from "mongoose";
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
  name: {
    in: "query",
    trim: true,
    optional: true,
  },
});

export const getSurgeries: Resource = get(
  "/users/:userId/surgeries",
  {
    auth: true,
    validators,
  },
  async (req: Request, res: Response) => {
    const { userId, name } = matchedData<{ userId: mongoose.Types.ObjectId | "@me"; name: string }>(req);

    let patient: mongoose.Types.ObjectId;
    if (userId === "@me") {
      patient = new mongoose.Types.ObjectId(req.userContext.sub);
    } else {
      patient = new mongoose.Types.ObjectId(userId);
    }

    const query: mongoose.FilterQuery<ISurgery> = { patient };

    if (name) {
      query["name"] = name;
    }

    const surgeries = await Surgery.find(query).lean();

    res.success(surgeries);
  },
);
