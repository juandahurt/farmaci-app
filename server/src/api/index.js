const express = require('express');
const restRouter = express.Router();
const categoryRouter = require('./components/category');
const productRouter = require('./components/product');
const dimensionRouter = require('./components/dimension');
const unitRouter = require('./components/unit');

restRouter.use('/category', categoryRouter);
restRouter.use('/product', productRouter);
restRouter.use('/dimension', dimensionRouter);
restRouter.use('/unit', unitRouter);

module.exports = restRouter;