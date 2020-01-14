const express = require('express');
const restRouter = express.Router();
const categoryRouter = require('./components/category');
const productRouter = require('./components/product');
const dimensionRouter = require('./components/dimension');

restRouter.use('/category', categoryRouter);
restRouter.use('/product', productRouter);
restRouter.use('/dimension', dimensionRouter);

module.exports = restRouter;