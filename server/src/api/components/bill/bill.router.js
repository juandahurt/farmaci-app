const express = require('express');
const billController = require('./bill.controller');

const billRouter = express.Router();

/**
 * Ruta que permite crear una nueva categoría
 */
billRouter.post('/', billController.create);

module.exports = billRouter;
