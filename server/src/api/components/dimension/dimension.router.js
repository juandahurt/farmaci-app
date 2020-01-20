const express = require('express');
const dimensionController = require('./dimension.controller');

const dimensionRouter = express.Router();

/**
 * Ruta que permite agregar las dimensiones de tipo de unidad a un producto
 */
dimensionRouter.post('/', dimensionController.create);

/**
 * Ruta que permite obtener las dimensiones de tipo de unidad de un producto
 */
dimensionRouter.get('/:id', dimensionController.get);

module.exports = dimensionRouter;
