import development from "./development.js";
import production from "./production.js";
import staging from "./staging.js";

const configMap = {
  development,
  production,
  staging,
};

const environment = process.env.NODE_ENV || "development";
const config = configMap[environment];

export default config;
