import express, { type Application } from "express";
import http from "http";

export const router: Application = express();
export const server = http.createServer(router);
