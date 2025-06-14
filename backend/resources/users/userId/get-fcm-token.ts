import type { Request, Response } from "express";
import { get, type Resource, type Validators } from "../../lib/resources";
import { checkSchema, matchedData } from "express-validator";
import mongoose from "mongoose";
import { Message } from "../../../common/messages";
import { FCMToken } from "../../../models/fcm-token";

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

export const getFCMTokens: Resource = get(
  "/users/:userId/fcmTokens",
  {
    auth: true,
    validators,
  },
  async (req: Request, res: Response) => {
    const { userId } = matchedData<{ userId: mongoose.Types.ObjectId | "@me" }>(req);

    let usrId: mongoose.Types.ObjectId;
    if (userId === "@me") {
      usrId = req.userContext.sub;
    } else {
      usrId = userId;
    }

    const fcmTokens = await FCMToken.find({ userId: usrId });

    res.success(fcmTokens);
  },
);
