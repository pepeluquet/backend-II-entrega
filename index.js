const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 8080;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('No se pudo iniciar el servidor por error en la BD:', err.message);
    process.exit(1);
  }
})();
