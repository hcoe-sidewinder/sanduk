import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { Middleware } from "./resources";
import { Logger } from "../../common/logger";
import { HTTP400Error } from "../../common/errors";

export const validationGate: Middleware = (req: Request, _res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (errors.isEmpty()) next();
  else {
    Logger.info(`got validation error on path:${req.url}`);
    throw new HTTP400Error(errors.array()[0]!.msg, errors.array());
  }
};
