import type { Request, Response } from "express";
import { post, type Resource, type Validators } from "../../lib/resources";
import { checkSchema, matchedData } from "express-validator";
import mongoose from "mongoose";
import { Message } from "../../../common/messages";
import { ProfileShare } from "../../../models/profile-share";
import { HTTPStatus } from "../../../common/http-status";
import { sendFCMNotification } from "../../lib/notification-helper";
import { FCMToken } from "../../../models/fcm-token";
import { HTTP404Error } from "../../../common/errors";

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
  doctorId: {
    in: "body",
    notEmpty: {
      errorMessage: "DOCTOR_ID_REQUIRED",
    },
    trim: true,
    isMongoId: {
      errorMessage: "DOCTOR_ID_INVALID",
    },
  },
});

export const shareProfile: Resource = post(
  "/users/:userId/share",
  {
    auth: true,
    validators,
  },
  async (req: Request, res: Response) => {
    const { userId, doctorId } = matchedData<{
      userId: mongoose.Types.ObjectId | "@me";
      doctorId: mongoose.Types.ObjectId;
    }>(req);

    let patient: mongoose.Types.ObjectId;
    if (userId === "@me") {
      patient = req.userContext.sub;
    } else {
      patient = userId;
    }

    await ProfileShare.create({ patient, doctor: doctorId });

    const docFCM = await FCMToken.findOne({ userId: doctorId });

    if (!docFCM) throw new HTTP404Error(Message.USER_NOT_FOUND);

    sendFCMNotification({
      token: docFCM.fcmToken!!,
      notification: { title: "A user shared a profile with you", body: "Test" },
    });

    res.empty(Message.CREATED, HTTPStatus.CREATED);
  },
);
