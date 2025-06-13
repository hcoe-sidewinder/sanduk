import { checkSchema, matchedData, validationResult } from "express-validator";
import type { Middleware, Validators } from "../../resources/lib/resources";
import type { UserContext } from "../../types/user-context";
import { Message } from "../../common/messages";
import { isBearerToken } from "../../resources/lib/custom-validators";
import type { Request, Response, NextFunction } from "express";
import { Logger } from "../../common/logger";
import { HTTP401Error } from "../../common/errors";
import jwt from "jsonwebtoken";
import { config } from "../../common/config";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      readonly userContext: UserContext;
    }
  }
}

export const validateToken: Validators = checkSchema({
  authorization: {
    in: "headers",
    notEmpty: {
      bail: true,
      errorMessage: Message.AUTH_MISSING,
    },
    // Custom validator to check if the Authorization header auth type is Bearer
    isBearerToken: {
      bail: true,
      custom: isBearerToken,
      errorMessage: Message.AUTH_TYPE_NOT_SUPPORTED,
    },
    // ltrim(Left Trimming) "Bearer" to only extract the token
    // Tried trimming "Bearer_space_" but it also trims the
    // first letter after space and results in INVALID_TOKEN 🤷
    ltrim: {
      options: ["Bearer"],
    },
    trim: true,
    isJWT: {
      errorMessage: Message.TOKEN_INVALID,
    },
  },
});

export const verifyToken: Middleware = (req: Request, _res: Response, next: NextFunction): void => {
  const tokenValidationError = validationResult(req);

  if (!tokenValidationError.isEmpty()) {
    Logger.info(`got token validation error on path:${req.url}`);
    throw new HTTP401Error(tokenValidationError.array()[0]!.msg);
  }

  const {
    authorization: token, // Renaming authorization to token
  } = matchedData<{ authorization: string }>(req);

  try {
    // @ts-expect-error: *
    req.userContext = jwt.verify(token, config.jwt.secretKey) as UserContext;
  } catch (error) {
    switch (true) {
      case error instanceof jwt.TokenExpiredError:
        throw new HTTP401Error(Message.TOKEN_EXPIRED);
      case error instanceof jwt.JsonWebTokenError:
        throw new HTTP401Error(Message.JWT_ERROR);
      default:
        throw new HTTP401Error();
    }
  }

  next();
};
