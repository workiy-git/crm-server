const configMap = {
  'development': require('../config/config.development'),
  'production': require('../config/config.production'),
  'staging': require('../config/config.staging')
};

const environment = process.env.NODE_ENV || 'development';
const config = configMap[environment];

module.exports = config;