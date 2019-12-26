const express = require('express');
const restRouter = express.Router();
const categoryRouter = require('./components/category');
const productRouter = require('./components/product');

restRouter.use('/category', categoryRouter);
restRouter.use('/product', productRouter);

module.exports = restRouter;