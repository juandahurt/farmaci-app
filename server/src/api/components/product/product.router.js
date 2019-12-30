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

/**
 * Ruta que permite obtener un producto
 */
categoryRouter.get('/:id', productController.get);

/**
 * Ruta que permite eliminar un producto
 */
categoryRouter.delete('/:id', productController.delete);

/**
 * Ruta que permite eliminar un producto
 */
categoryRouter.put('/:id', productController.update);

module.exports = categoryRouter;
