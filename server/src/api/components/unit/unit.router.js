const express = require('express');
const unitController = require('./unit.controller');

const unitRouter = express.Router();

/**
 * Ruta que permite registrar una nueva unidad
 */
unitRouter.post('/:id', unitController.create);

/**
 * Ruta que permite listar todos las unidades de un producto
 */
unitRouter.get('/:id', unitController.list);

/**
 * Ruta que permite eliminar una unidad de un producto
 */
unitRouter.delete('/:product_id/:unit_id', unitController.delete);

module.exports = unitRouter;
