import { NextFunction, Request, Response, Router } from "express";
import { HTTP400Error, HTTPClientError } from "../common/errors";
import { Message } from "../common/messages";
import { Logger } from "../common/logger";
import { HTTPStatus } from "../common/http-status";

const handle404Error = () => {
  throw new HTTP400Error(Message.NOT_FOUND);
};

const handleClientErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HTTPClientError) {
    Logger.error(`${req.method.toUpperCase()}: ${req.path} client error ${err.message}`, err);

    res.error(err.message, err.statusCode, err.errors);
  } else {
    next(err);
  }
};

/* https://expressjs.com/en/guide/using-middleware.html#middleware.error-handling

Error-handling middleware always takes four arguments. You must provide four
arguments to identify it as an error-handling middleware function. Even if you
don’t need to use the `next` object, you must specify it to maintain the
signature. Otherwise, the `next` object will be interpreted as regular middleware
and will fail to handle errors. */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleServerErrors = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  Logger.error(`${req.method.toUpperCase()}: ${req.path} server error ${err.message}`, err);
  res.error(Message.INTERNAL_SERVER_ERROR, HTTPStatus.INTERNAL_SERVER_ERROR, err);
};

export const registerErrorHandlers = (router: Router) => {
  router.use(handle404Error);
  router.use(handleClientErrors);
  router.use(handleServerErrors);
};
