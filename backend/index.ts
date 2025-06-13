import { configDotenv } from "dotenv";
import { config, makeConfig } from "./common/config";
import { Logger } from "./common/logger";
import { setupDB } from "./database/setup-db";
import { startServer } from "./server";

process.on("uncaughtException", (e) => {
  Logger.error(e.message, e);
  process.exit(1);
});

process.on("unhandledRejection", (e) => {
  Logger.error(`"unhandledRejection ${e}`);
  process.exit(1);
});

const tearDown = async () => process.exit();

process.on("SIGINT", tearDown);
process.on("SIGUSR1", tearDown);
process.on("SIGUSR2", tearDown);
process.on("SIGTERM", tearDown);

function main() {
  makeConfig();

  Logger.info("starting with config");
  Logger.info(JSON.stringify(config, null, 4));

  setupDB();

  Logger.info("setting up database");

  startServer();
}

configDotenv();

main();
