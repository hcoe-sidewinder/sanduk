import { Handler } from "express";

const asyncHandler =
  (handler: Handler): Handler =>
  (req, res, next) =>
    Promise.resolve(handler(req, res, next)).catch(next);

export const asyncHandlers = (handlers: Handler[]): Handler[] => handlers.map((handler) => asyncHandler(handler));
