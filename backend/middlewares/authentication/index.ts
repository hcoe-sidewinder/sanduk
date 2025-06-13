import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../common/config";
import type { Payload } from "../../types/payload";

export const hashPassword = (plainPassword: string) => bcrypt.hashSync(plainPassword, config.password.salt);

export const verifyPassword = (plainPassowrd: string, hashPassword: string) =>
  bcrypt.compareSync(plainPassowrd, hashPassword);

export const createPayload = (data: Omit<Payload, "exp">): Payload => {
  return {
    ...data,
    /* exp is in seconds */
    exp: Math.ceil(
      Date.now() / 1000 +
        (data.type === "ACCESS" ? config.jwt.accessTokenExpiryMinute : config.jwt.refreshTokenExpiryMinute) * 60,
    ), // https://www.npmjs.com/package/jsonwebtoken#token-expiration-exp-claim
  };
};

export const createToken = (payload: Payload): string => jwt.sign(payload, config.jwt.secretKey);
