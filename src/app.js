const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const viewsRouter = require('./routes/views.router.js');
const createSessionsRouter = require('./routes/sessions.router.js');
const fs = require('fs');
const connectDB = require('./config/db');
const passport = require('passport');
const UsersDao = require('./dao/users.dao.js');
const UsersService = require('./services/users.services.js');
require('./config/passport.config')(passport);


const app = express();
const PORT = 8080;

// Conectar a la base de datos
connectDB();

// Configuración de Handlebars
const hbs = exphbs.create({
    helpers: {
        eq: (a, b) => a == b
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Inicializar el servicio de usuarios
const usersDao = new UsersDao();
const usersService = new UsersService(usersDao);
const sessionsRouter = createSessionsRouter(usersService, passport);

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);
app.use(passport.initialize());

// const productsPath = path.join(__dirname, 'data', 'products.json');

// Ruta para renderizar index.handlebars
// app.get('/', (req, res) => {
//     let products = [];
//     try {
//         const data = fs.readFileSync(productsPath, 'utf-8');
//         products = JSON.parse(data);
//     } catch (error) {
//         console.error('Error leyendo products.json:', error);
//     }
//     res.render('index', {
//         title: 'Inicio',
//         mensaje: 'InaYoga!',
//         products 
//     });
// });

// Ruta para renderizar realtimeProducts.handlebars
// app.get('/realtimeproducts', (req, res) => {
//     let products = [];
//     try {
//         const data = fs.readFileSync(productsPath, 'utf-8');
//         products = JSON.parse(data);
//     } catch (error) {
//         console.error('Error leyendo products.json:', error);
//     }
//     res.render('realtimeProducts', { products });
// });

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Rutas
app.use('/', viewsRouter);

module.exports = app;