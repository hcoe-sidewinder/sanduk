import { NextFunction, Request, Response } from "express";

type Handler = (req: Request, res: Response) => Promise<void> | void;

export type Validators = Middleware[];

export type Middleware = (request: Request, response: Response, next: NextFunction) => void;

export interface Resource {
  path: string;
  method: Method;
  auth?: boolean;
  validators?: Middleware[];
  handler: Handler;
}

type ResourceConfig = Omit<Omit<Omit<Resource, "handler">, "path">, "method">;

export enum Method {
  GET = "get",
  POST = "post",
  PUT = "put",
  PATCH = "patch",
  HEAD = "head",
  OPTIONS = "options",
  DELETE = "delete",
}

export const resource = (path: string, method: Method, config: ResourceConfig, handler: Handler): Resource => {
  return {
    method,
    path,
    handler,
    ...config,
  };
};

export const get = (path: string, config: ResourceConfig, handler: Handler): Resource =>
  resource(path, Method.GET, config, handler);

export const post = (path: string, config: ResourceConfig, handler: Handler): Resource =>
  resource(path, Method.POST, config, handler);

export const put = (path: string, config: ResourceConfig, handler: Handler): Resource =>
  resource(path, Method.PUT, config, handler);

export const patch = (path: string, config: ResourceConfig, handler: Handler): Resource =>
  resource(path, Method.PATCH, config, handler);

export const _delete = (path: string, config: ResourceConfig, handler: Handler): Resource =>
  resource(path, Method.DELETE, config, handler);
