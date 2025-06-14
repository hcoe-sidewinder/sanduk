import { checkSchema, matchedData } from "express-validator";
import { post, type Resource, type Validators } from "../lib/resources";
import type { Request, Response } from "express";
import { Message } from "../../common/messages";
import { User } from "../../models/user";
import { HTTP401Error, HTTP404Error } from "../../common/errors";
import { createPayload, createToken, verifyPassword } from "../../middlewares/authentication";
import { Session } from "../../models/session";

const validators: Validators = checkSchema({
  nidNo: {
    in: "body",
    notEmpty: {
      errorMessage: Message.NID_NO_REQUIRED,
    },
    trim: true,
  },
  password: {
    in: "body",
    notEmpty: {
      errorMessage: Message.PASSWORD_REQUIRED,
    },
  },
});

export const newUserSession: Resource = post(
  "/users/sessions",
  {
    auth: false,
    validators,
  },
  async (req: Request, res: Response) => {
    const { nidNo, password } = matchedData<{ nidNo: string; password: string }>(req);

    const user = await User.findOne({ nidNo }, ["_id", "isDoctor", "password", "role"]);

    if (!user) throw new HTTP404Error(Message.USER_NOT_FOUND);

    if (!verifyPassword(password, user.password)) throw new HTTP401Error(Message.USER_WRONG_CRED);

    const accessPayload = createPayload({
      sub: user._id,
      type: "ACCESS",
      role: user.role,
      isDoctor: user.isDoctor,
    });

    const accessToken = createToken(accessPayload);

    const refreshPayload = createPayload({
      sub: user._id,
      type: "REFRESH",
      role: user.role,
      isDoctor: user.isDoctor,
    });

    const refreshToken = createToken(refreshPayload);

    await Session.create({
      userId: user._id,
      refreshToken,
    });

    const dbUser = await User.findOne({ nidNo }).lean();

    res.success({
      ...dbUser,
      accessToken,
      refreshToken,
      atexp: accessPayload.exp,
      rtexp: refreshPayload.exp,
    });
  },
);
