import mongoose from "mongoose";
import { config } from "../common/config";
import { Logger } from "../common/logger";

export async function setupDB() {
  const dbUserName = config.db.userName;
  const dbPassword = encodeURIComponent(config.db.password);
  const dbHost = config.db.url;
  const dbName = config.db.name;
  const dbOptions = `retryWrites=true&w=majority&appName=${dbName}`;

  try {
    await mongoose.connect(`mongodb+srv://${dbUserName}:${dbPassword}@${dbHost}/?${dbOptions}`);

    Logger.info("DB Connection Established...");
  } catch (error) {
    Logger.error("DB Connection failed...", error);
    process.exit(1);
  }
}
