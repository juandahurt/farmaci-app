const express = require('express');
const categoryController = require('./category.controller');

const categoryRouter = express.Router();

/**
 * Ruta que permite crear una nueva categoría
 */
categoryRouter.post('/', categoryController.create);

/**
 * Ruta que permite obtener las categorías registradas
 */
categoryRouter.get('/', categoryController.list);

module.exports = categoryRouter;
