const path = require('path');
// Carga variables de entorno desde el archivo .env en la raíz
require('dotenv').config();

// Exporta un objeto con la configuración usada por la aplicación.
// Los comentarios y mensajes están en castellano para mayor claridad.
module.exports = {
    // Puerto de la aplicación
    PORT: process.env.PORT || 8080,

    // Persistencia (file, mongo, etc.)
    PERSISTENCE: process.env.PERSISTENCE || 'file',

    // Rutas a archivos locales (si se usa persistencia en ficheros)
    PRODUCTS_FILE: path.join(__dirname, '..', 'data', 'products.json'),
    CARTS_FILE: path.join(__dirname, '..', 'data', 'carts.json'),

    // Base de datos: usa MONGO_URL o MONGODB_URI (si están definidas),
    // si no, se conecta a una BD local por defecto.
    MONGO_URL: process.env.MONGO_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/backendDB',

    // JWT: secreción utilizada para firmar y verificar tokens JWT.
    // Define JWT_SECRET en tu .env con un valor seguro (p. ej. 48 bytes hex).
    JWT_SECRET: process.env.JWT_SECRET || process.env.SECRET_KEY || 'reemplazar_por_un_secreto_seguro',

    // Credenciales para envío de correo (SMTP)
    MAILING_USER: process.env.MAILING_USER || '',
    MAILING_PASS: process.env.MAILING_PASS || ''
};
