export default {
    MONGO_DB_URI: process.env.MONGO_DB_URI || 'mongodb://localhost:27023',
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key'
}