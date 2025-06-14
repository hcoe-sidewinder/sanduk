import { checkSchema, matchedData } from "express-validator";
import { get, type Validators } from "../lib/resources";
import mongoose from "mongoose";
import { Message } from "../../common/messages";
import type { Request, Response } from "express";
import { User, type IUser } from "../../models/user";
import { hasPermission } from "../lib/access-contorl/abac";
import { HTTP404Error } from "../../common/errors";

const validators: Validators = checkSchema({
  adminId: {
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

export const getMembers = get(
  "/admins/:adminId/members",
  {
    auth: true,
    validators,
  },
  async (req: Request, res: Response) => {
    const { adminId } = matchedData<{ adminId: mongoose.Types.ObjectId | "@me" }>(req);

    let admId: mongoose.Types.ObjectId;
    if (adminId === "@me") {
      admId = new mongoose.Types.ObjectId(req.userContext.sub);
    } else {
      admId = new mongoose.Types.ObjectId(adminId);
    }

    const members: IUser[] | null = await User.find({ familyAdmin: admId });

    if (!members) throw new HTTP404Error(Message.USER_NOT_FOUND);

    const allowedMembers: IUser[] = members.filter((member) => hasPermission(req.userContext, "users", "view", member));

    res.success(allowedMembers);
  },
);
