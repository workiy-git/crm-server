module.exports = {
    port: process.env.PORT || 7000, // Use environment variable for port in production
    database: {
        // Production database configuration
        // Example: mongodb://production_server/mydatabase
        uri: 'mongodb://production_server/mydatabase'
    },
    cors: {
        // Set CORS origin for production
        origin: 'https://yourproductiondomain.com'
    }
};
