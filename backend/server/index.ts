import { Application } from "express";
import { registerErrorHandlers } from "./error-handlers";
import { router, server } from "./http";
import { registerTopLevelMiddlewares } from "./top-level-middlewares";
import { config } from "../common/config";
import { Logger } from "../common/logger";
import { registerResources } from "../resources/register-routes";

export const setupMiddlewares = (router: Application) => {
  registerTopLevelMiddlewares(router);
  registerResources(router);
  registerErrorHandlers(router);
};

export const startServer = () => {
  setupMiddlewares(router);

  server.listen(config.http.port, () => {
    Logger.info(`🚀 Server started on port ${config.http.port}`);
  });
};
