const express = require('express');
const productController = require('./product.controller');

const categoryRouter = express.Router();

/**
 * Ruta que permite crear un nuevo producto
 */
categoryRouter.post('/', productController.create);

/**
 * Ruta que permite listar todos los productos
 */
categoryRouter.get('/', productController.list);

module.exports = categoryRouter;
