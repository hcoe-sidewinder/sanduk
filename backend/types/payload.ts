import type mongoose from "mongoose";
import type { Role } from "../models/types/user";

export type Payload = {
  sub: mongoose.Types.ObjectId;
  exp: number;
  type: "ACCESS" | "REFRESH";
  role: Role;
  isDoctor: boolean;
};
