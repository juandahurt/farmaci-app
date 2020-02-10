const express = require('express');
const providerController = require('./provider.controller');

const providerRouter = express.Router();

/**
 * Ruta que permite registrar un proveedor
 */
providerRouter.post('/', providerController.create);

/**
 * Ruta que permite obtener todos los proveedores
 */
providerRouter.get('/', providerController.list);

/**
 * Ruta que permite eliminar un proveedor
 */
providerRouter.delete('/:id', providerController.delete);

module.exports = providerRouter;
