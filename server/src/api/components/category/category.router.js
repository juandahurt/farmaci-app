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

/**
 * Ruta que permite obtener una categoría
 */
categoryRouter.get('/:id', categoryController.get);

/**
 * Ruta que permite actualizar una categoría
 */
categoryRouter.put('/:id', categoryController.update);

/**
 * Ruta que permite eliminar una categoría
 */
categoryRouter.delete('/:id', categoryController.delete);

module.exports = categoryRouter;
