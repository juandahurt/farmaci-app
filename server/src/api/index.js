const express = require('express');
const restRouter = express.Router();
const categoryRouter = require('./components/category');
const productRouter = require('./components/product');
const dimensionRouter = require('./components/dimension');
const unitRouter = require('./components/unit');
const billRouter = require('./components/bill');
const statsRouter = require('./components/stats');
const expenseRouter = require('./components/expense');
const providerRouter = require('./components/provider');
const notificationRouter = require('./components/notification');

restRouter.use('/category', categoryRouter);
restRouter.use('/product', productRouter);
restRouter.use('/dimension', dimensionRouter);
restRouter.use('/unit', unitRouter);
restRouter.use('/bill', billRouter);
restRouter.use('/stats', statsRouter);
restRouter.use('/expense', expenseRouter);
restRouter.use('/provider', providerRouter);
restRouter.use('/notification', notificationRouter);

module.exports = restRouter;