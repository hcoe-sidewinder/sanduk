import type { Request, Response } from "express";
import { get, type Resource, type Validators } from "../lib/resources";
import { User } from "../../models/user";
import { HTTP404Error } from "../../common/errors";
import { Message } from "../../common/messages";

const validators: Validators = [];

export const getDoctors: Resource = get(
  "/doctors",
  {
    auth: false,
    validators,
  },
  async (_req: Request, res: Response) => {
    const doctors = await User.find({ isDoctor: true }).lean();

    if (!doctors) throw new HTTP404Error(Message.USER_NOT_FOUND);

    res.success(doctors);
  },
);
