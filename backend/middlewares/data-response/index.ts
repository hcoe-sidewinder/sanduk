import { NextFunction, Request, Response } from "express";
import { HTTPStatus } from "../../common/http-status";
import { Message } from "../../common/messages";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Response {
      readonly dataResponse: <T>(data: T, message: Message, status: HTTPStatus, errors?: unknown) => void;
      readonly success: <T>(data: T, message?: Message, status?: HTTPStatus) => void;
      readonly error: (message: string, status?: HTTPStatus, errors?: unknown) => void;
      readonly empty: (message?: Message, status?: HTTPStatus) => void;
    }
  }
}

export interface DataResponse<T> {
  message?: string;
  data?: T;
  error?: {
    meta?: unknown;
  };
  meta: {
    path: string;
    id: string;
    timestamp: string;
  };
}

export const dataResponse = () => (request: Request, response: Response, next: NextFunction) => {
  // @ts-expect-error: *
  response.dataResponse = <T>(data: T, message: Message, status: HTTPStatus, errors?: unknown) => {
    const error = errors ? { meta: errors } : undefined;

    response.status(status).send({
      data,
      message,
      meta: {
        path: request.path,
        timestamp: new Date().toISOString(),
      },
      error,
    } as DataResponse<T>);
  };

  // @ts-expect-error: *
  response.success = <T>(data: T, message = Message.SUCCESS, status: HTTPStatus = HTTPStatus.SUCCESS) => {
    if (status) response.status(status);

    response.send({
      message,
      data,
      meta: {
        path: request.path,
        timestamp: new Date().toISOString(),
      },
    } as DataResponse<T>);
  };

  // @ts-expect-error: *
  response.empty = (message: Message = Message.SUCCESS, status: HTTPStatus = HTTPStatus.SUCCESS) => {
    response.success(undefined, message, status);
  };

  // @ts-expect-error: *
  response.error = (
    message: Message = Message.BAD_REQUEST,
    status: HTTPStatus = HTTPStatus.BAD_REQUEST,
    errors: unknown | undefined,
  ) => {
    response.dataResponse(undefined, message, status, errors);
  };

  next();
};
