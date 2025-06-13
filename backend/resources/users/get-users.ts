import type { Request, Response } from "express";
import { get, type Resource, type Validators } from "../lib/resources";
import { User } from "../../models/user";

const validators: Validators = [];

export const getUsers: Resource = get(
  "/users",
  {
    auth: false,
    validators,
  },
  async (_req: Request, res: Response) => {
    const user = await User.find();

    res.success(user);
  },
);
