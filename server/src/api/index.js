const express = require('express');
const restRouter = express.Router();
const categoryRouter = require('./components/category');

restRouter.use('/category', categoryRouter);

module.exports = restRouter;