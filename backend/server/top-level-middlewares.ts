import cors from "cors";
import { json, type Router, urlencoded } from "express";
import { dataResponse } from "../middlewares/data-response";

export const registerTopLevelMiddlewares = (router: Router) => {
  router.use(cors());
  router.use(urlencoded({ extended: true }));
  router.use(json());
  router.use(dataResponse());
};
