const development = require("./development.js");
const production = require("./production.js");
const staging = require("./staging.js");

const configMap = {
  development,
  production,
  staging,
};

const environment = "staging";
const config = configMap[environment];

module.exports = config;
