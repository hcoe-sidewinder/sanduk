import type { Request, Response } from "express";
import { post, type Resource, type Validators } from "../../lib/resources";
import { checkSchema, matchedData } from "express-validator";
import mongoose from "mongoose";
import { Message } from "../../../common/messages";
import { hasPermission } from "../../lib/access-contorl/abac";
import { HTTP403Error } from "../../../common/errors";
import { HereditaryDisease, type IHereditaryDisease } from "../../../models/hereditary-disease";
import { ALL_FORMULATION } from "../../../models/types/medicine";
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
  doctor: {
    in: "body",
    notEmpty: {
      errorMessage: "DOCTOR_REQUIRED",
    },
    isMongoId: {
      errorMessage: Message.NOT_A_MONGOID,
    },
  },
  medicines: {
    in: "body",
    isArray: {
      bail: true,
      options: {
        min: 1,
      },
    },
  },
  "medicines.*.formulation": {
    in: "body",
    notEmpty: {
      errorMessage: "MEDICINE_FORMULATION_REQUIRED",
    },
    trim: true,
    toUpperCase: true,
    isIn: {
      options: [ALL_FORMULATION],
      errorMessage: "FORMULATION_INVALID",
    },
  },
  "medicines.*.name": {
    in: "body",
    notEmpty: {
      errorMessage: "MEDICINE_NAME_REQUIRED",
    },
    trim: true,
  },
  "medicines.*.strength": {
    in: "body",
    notEmpty: {
      errorMessage: "MEDICINE_STRENGTH_REQUIRED",
    },
    trim: true,
  },
  "medicines.*.frequency": {
    in: "body",
    notEmpty: {
      errorMessage: "MEDICINE_FREQUENCY_REQUIRED",
    },
    trim: true,
  },
  "medicines.*.duration": {
    in: "body",
    notEmpty: {
      errorMessage: "MEDICINE_DURATION_REQUIRED",
    },
    trim: true,
  },
});

export const newMedicines: Resource = post(
  "/users/:userId/medicines",
  {
    auth: true,
    validators,
  },
  async (req: Request, res: Response) => {
    const { userId, doctor, medicines } = matchedData<{
      userId: mongoose.Types.ObjectId | "@me";
      doctor: mongoose.Types.ObjectId | "@me";
      medicines: { formulation: string; name: string; strength: string; frequency: string; duration: string }[];
    }>(req);

    let patient: mongoose.Types.ObjectId;
    if (userId === "@me") {
      patient = req.userContext.sub;
    } else {
      patient = userId;
    }

    await Medicine.create({ patient, doctor, medicines });

    res.empty();
  },
);
