import type { Request, Response } from "express";
import { get, type Resource, type Validators } from "../../lib/resources";
import { checkSchema, matchedData } from "express-validator";
import mongoose from "mongoose";
import { Message } from "../../../common/messages";
import { Medicine } from "../../../models/medicine";

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

export const getMedicines: Resource = get(
  "/users/:userId/medicines",
  {
    auth: true,
    validators,
  },
  async (req: Request, res: Response) => {
    const { userId } = matchedData<{
      userId: mongoose.Types.ObjectId | "@me";
    }>(req);

    let patient: mongoose.Types.ObjectId;
    if (userId === "@me") {
      patient = req.userContext.sub;
    } else {
      patient = userId;
    }

    const medicines = await Medicine.find({ patient }).lean();

    res.success(medicines);
  },
);
