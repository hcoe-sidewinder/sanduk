import type { Request, Response } from "express";
import { get, type Resource, type Validators } from "../../lib/resources";
import { checkSchema, matchedData } from "express-validator";
import mongoose from "mongoose";
import { Message } from "../../../common/messages";
import { User, type IUser } from "../../../models/user";
import { hasPermission } from "../../lib/access-contorl/abac";
import { HTTP403Error, HTTP404Error } from "../../../common/errors";

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

export const getUser: Resource = get(
  "/users/:userId",
  {
    auth: true,
    validators,
  },
  async (req: Request, res: Response) => {
    const { userId } = matchedData<{ userId: mongoose.Types.ObjectId | "@me" }>(req);

    let usrId: mongoose.Types.ObjectId;
    if (userId === "@me") {
      usrId = new mongoose.Types.ObjectId(req.userContext.sub);
    } else {
      usrId = new mongoose.Types.ObjectId(userId);
    }

    const user: IUser | null = await User.findById(usrId);

    if (!user) throw new HTTP404Error(Message.USER_NOT_FOUND);

    if (!hasPermission(req.userContext, "users", "view", user)) throw new HTTP403Error();

    res.success(user);
  },
);
