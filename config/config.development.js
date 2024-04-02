// config.development.js
module.exports = {
    port: 9000,
    database: {
        uri: 'mongodb://localhost:27017/CRM'
    },
    cors: {
        origin: 'http://localhost:3000'
    }
};
