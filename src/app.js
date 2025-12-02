const express = require('express');
const passport = require('passport');

const UsersDAO = require('./dao/users.dao');
const UsersService = require('./services/users.service');
const createSessionsRouter = require('./routes/sessions.router');
const initPassport = require('./config/passport');
const CartsDAO = require('./dao/carts.dao');
const ProductDao = require('./dao/products.dao');
const ProductsService = require('./services/products.services');
const createProductsRouter = require('./routes/products.router');
const CartsService = require('./services/carts.service');
const createCartsRouter = require('./routes/carts.router');

const usersDAO = new UsersDAO();
const usersService = new UsersService(usersDAO);
const cartsDAO = new CartsDAO();
const productsDAO = new ProductDao(); // ⭐ usar ProductDao existente
const productsService = new ProductsService(productsDAO);
const cartsService = new CartsService(cartsDAO, productsDAO);

initPassport(passport, usersService);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cookie-parser')());
app.use(passport.initialize());

app.use('/api/sessions', createSessionsRouter(usersService, passport));
app.use('/api/products', createProductsRouter(productsService, passport));
app.use('/api/carts', createCartsRouter(cartsService, passport));

module.exports = app;