import { Config } from "./Config";

export const buildConfig = (env: NodeJS.Dict<string>): Config => {
  const requireEnv = (key: string): string => {
    if (env[key]) {
      return env[key];
    } else {
      throw new Error(`required env '${key}' is not provided`);
    }
  };

  const port = Number(env["PORT"]) || 8080;

  const databaseUrl = requireEnv("DATABASE_URL");
  const dbUserName = requireEnv("DB_USER_NAME");
  const dbPassword = requireEnv("DB_PASSWORD");
  const dbName = requireEnv("DB_NAME");

  const salt = Number(env["SALT"]) || 10;

  const accessTokenExpiryMinute: number = Number(env["ACCESS_TOKEN_EXPIRY_MINUTE"]) || 60;
  const secretKey: string = requireEnv("JWT_SECRET_KEY");
  const refreshTokenExpiryMinute: number = Number(env["REFRESH_TOKEN_EXPIRY_MINUTE"]) || 600;

  return {
    http: {
      port,
      cors: env["CORS"] ?? "*",
    },
    db: {
      userName: dbUserName,
      password: dbPassword,
      url: databaseUrl,
      name: dbName,
    },
    password: {
      salt,
    },
    jwt: {
      accessTokenExpiryMinute,
      refreshTokenExpiryMinute,
      secretKey,
    },
  };
};
