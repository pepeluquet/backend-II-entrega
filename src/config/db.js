require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URL;
if (!uri) {
  throw new Error('MONGO_URL no definida en .env');
}

const connectDB = async () => {
  try {
    await mongoose.connect(uri); // opciones por defecto
    console.log('MongoDB conectado');
  } catch (err) {
    console.error('Error conectando a MongoDB:', err.message);
    throw err; // propagar para que el proceso no continúe
  }
};

module.exports = connectDB;