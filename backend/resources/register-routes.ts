import { Handler, Router } from "express";
import { Resource } from "./lib/resources";
import { validationGate } from "./lib/validation-gate";
import { asyncHandlers } from "./lib/handler";
import { newUser } from "./users/new-user";
import { getUsers } from "./users/get-users";
import { newUserSession } from "./users/new-session";
import { validateToken, verifyToken } from "../middlewares/authentication/middleware";
import { newReports } from "./users/userId/new-report";
import { getReports } from "./users/userId/get-reports";
import { newVaccine } from "./users/userId/new-vaccine";
import { getVaccines } from "./users/userId/get-vaccines";
import { newHereditaries } from "./users/userId/new-hereditary";
import { getHereditaries } from "./users/userId/get-hereditary";
import { getUser } from "./users/userId/get-user";
import { getMembers } from "./admins/get-members";
import { getDoctors } from "./doctors/getDoctors";
import { getSurgeries } from "./users/userId/get-surgeries";
import { newSurgeries } from "./users/userId/new-surgery";
import { shareProfile } from "./users/userId/share";
import { newFCMToken } from "./users/userId/new-fcm-token";
import { getFCMTokens } from "./users/userId/get-fcm-token";
import { newAllergies } from "./users/userId/new-allergies";

export const resources: Record<string, Record<string, Resource>> = {
  users: { newUser, getUsers, newUserSession, getUser, shareProfile, newFCMToken, getFCMTokens, newAllergies },
  labReports: { newReports, getReports },
  vaccines: { newVaccine, getVaccines },
  hereditarues: { newHereditaries, getHereditaries },
  admins: { getMembers },
  doctors: { getDoctors },
  surgeries: { getSurgeries, newSurgeries },
};

export const registerResources = (router: Router) => {
  const allResources = Object.values(resources).flatMap((resources) => Object.values(resources));

  allResources.forEach((resource) => {
    const handlers: Handler[] = [
      ...(resource.auth ? [...validateToken, verifyToken] : []),
      ...(resource.validators ?? []),
      validationGate,
      resource.handler,
    ];
    router[resource.method]("/api" + resource.path, asyncHandlers(handlers));
  });
};
