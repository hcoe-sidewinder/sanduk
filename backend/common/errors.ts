import { ValidationError } from "express-validator";
import { HTTPStatus } from "./http-status";
import { Message } from "./messages";

export abstract class HTTPClientError extends Error {
  readonly statusCode: HTTPStatus = HTTPStatus.BAD_REQUEST;

  errors?: ValidationError[] | unknown[] | undefined;

  protected constructor(message: object | string) {
    super(message.toString());
    Object.setPrototypeOf(this, HTTPClientError.prototype);
  }
}

export class HTTP400Error extends HTTPClientError {
  override readonly statusCode = HTTPStatus.BAD_REQUEST;

  constructor(
    message: string | object = Message.BAD_REQUEST,
    errors: ValidationError[] | unknown[] | undefined = undefined,
  ) {
    super(message);
    this.errors = errors;
  }
}

export class HTTP401Error extends HTTPClientError {
  override readonly statusCode = HTTPStatus.NOT_AUTHORIZED;

  constructor(message: string | object = Message.NOT_AUTHORIZED) {
    super(message);
  }
}

export class HTTP403Error extends HTTPClientError {
  override readonly statusCode = HTTPStatus.PERMISSION_DENIED;

  constructor(message: string | object = Message.PERMISSION_DENIED) {
    super(message);
  }
}

export class HTTP404Error extends HTTPClientError {
  override readonly statusCode = HTTPStatus.NOT_FOUND;

  constructor(message: string | object = Message.NOT_FOUND) {
    super(message);
  }
}
