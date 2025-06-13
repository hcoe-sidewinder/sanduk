import { buildConfig } from "./build-config";
import { Config } from "./Config";

let config: Config;

const makeConfig = (env: NodeJS.Dict<string> = process.env) => {
  config = buildConfig(env);
};

export { makeConfig, config };
