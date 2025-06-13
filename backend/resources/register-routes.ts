import { Handler, Router } from "express";
import { Resource } from "./lib/resources";
import { validationGate } from "./lib/validation-gate";
import { asyncHandlers } from "./lib/handler";

export const resources: Record<string, Record<string, Resource>> = {
  test: {},
};

export const registerResources = (router: Router) => {
  const allResources = Object.values(resources).flatMap((resources) => Object.values(resources));

  allResources.forEach((resource) => {
    const handlers: Handler[] = [
      // ...(resource.auth ? [...validateToken, verifyToken] : []),
      ...(resource.validators ?? []),
      validationGate,
      resource.handler,
    ];
    router[resource.method](resource.path, asyncHandlers(handlers));
  });
};
