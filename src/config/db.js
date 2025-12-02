require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URL;
if (!uri) {
  throw new Error('MONGO_URL no definida en .env');
}

const connectDB = async () => {
  try {
    await mongoose.connect(uri); 
    console.log('MongoDB conectado');
  } catch (err) {
    console.error('Error conectando a MongoDB:', err.message);
    throw err; 
  }
};

module.exports = connectDB;