import type { Request, Response } from "express";
import { post, type Resource, type Validators } from "../../lib/resources";
import { checkSchema, matchedData } from "express-validator";
import mongoose from "mongoose";
import { Message } from "../../../common/messages";
import { FCMToken } from "../../../models/fcm-token";
import { HTTPStatus } from "../../../common/http-status";

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
  fcmToken: {
    in: "body",
    notEmpty: {
      errorMessage: "FCM_TOKEN_REQUIRED",
    },
  },
});

export const newFCMToken: Resource = post(
  "/users/:userId/fcmTokens",
  {
    auth: true,
    validators,
  },
  async (req: Request, res: Response) => {
    const { userId, fcmToken } = matchedData<{ userId: mongoose.Types.ObjectId | "@me"; fcmToken: string }>(req);

    let usrId: mongoose.Types.ObjectId;
    if (userId === "@me") {
      usrId = req.userContext.sub;
    } else {
      usrId = userId;
    }

    await FCMToken.create({ userId: usrId, fcmToken: fcmToken });

    res.empty(Message.CREATED, HTTPStatus.CREATED);
  },
);
