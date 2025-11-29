const path = require('path');
require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 8080,
    PERSISTENCE: process.env.PERSISTENCE || 'file',
    PRODUCTS_FILE: path.join(__dirname, '..', 'data', 'products.json'),
    CARTS_FILE: path.join(__dirname, '..', 'data', 'carts.json'),

    // Database
    MONGO_URL: process.env.MONGO_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/backendDB',

    // JWT
    JWT_SECRET: process.env.JWT_SECRET || process.env.SECRET_KEY || 'SECRET_KEY',

    // Mailer credentials
    MAILING_USER: process.env.MAILING_USER || '',
    MAILING_PASS: process.env.MAILING_PASS || ''
};
