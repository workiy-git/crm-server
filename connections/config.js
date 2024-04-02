// config.js
const developmentConfig = require('../config/config.development');
const productionConfig = require('../config/config.production');

const getConfig = () => {
  const environment = process.env.NODE_ENV || 'development';
  return environment === 'production' ? productionConfig : developmentConfig;
};

module.exports = getConfig();

