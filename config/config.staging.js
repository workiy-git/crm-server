module.exports = {
    port: process.env.PORT || 7001, // Use a different port for staging
    database: {
        // Staging database configuration
        // Example: mongodb://staging_server/mydatabase
        uri: 'mongodb://staging_server/mydatabase'
    },
    cors: {
        // Set CORS origin for staging
        origin: 'https://yourstagingdomain.com'
    }
};