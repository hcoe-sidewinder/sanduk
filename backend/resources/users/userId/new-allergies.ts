import { checkSchema, matchedData } from "express-validator";
import { post, type Resource, type Validators } from "../../lib/resources";
import mongoose from "mongoose";
import { Message } from "../../../common/messages";
import type { Request, Response } from "express";
import { User } from "../../../models/user";

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
  allergies: {
    in: "body",
    isArray: {
      bail: true,
      options: { min: 1 },
      errorMessage: "EXPECTED_AN_ARRAY_DID_NOT_SATISFY",
    },
  },
});

export const newAllergies: Resource = post(
  "/users/:userId/allergies",
  {
    auth: true,
    validators,
  },
  async (req: Request, res: Response) => {
    const { userId, allergies } = matchedData<{ userId: mongoose.Types.ObjectId | "@me"; allergies: string[] }>(req);

    let usrId: mongoose.Types.ObjectId;
    if (userId === "@me") {
      usrId = req.userContext.sub;
    } else {
      usrId = userId;
    }

    const updatedUser = await User.findByIdAndUpdate(
      usrId,
      { $addToSet: { allergies: { $each: allergies } } },
      { new: true, runValidators: true },
    );

    res.success(updatedUser);
  },
);
