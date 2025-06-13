import { Handler, Router } from "express";
import { Resource } from "./lib/resources";
import { validationGate } from "./lib/validation-gate";
import { asyncHandlers } from "./lib/handler";
import { newUser } from "./users/new-user";
import { getUsers } from "./users/get-users";

export const resources: Record<string, Record<string, Resource>> = {
  users: { newUser, getUsers },
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
    router[resource.method]("/api" + resource.path, asyncHandlers(handlers));
  });
};
