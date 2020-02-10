const express = require('express');
const expenseController = require('./expense.controller');

const expenseRouter = express.Router();

/**
 * Ruta que permite registrar un nuevo egreso
 */
expenseRouter.post('/', expenseController.create);

/**
 * Ruta que permite listar todos los egresos
 */
expenseRouter.get('/', expenseController.list);

/**
 * Ruta que permite eliminar un egreso
 */
expenseRouter.delete('/:id', expenseController.delete);

module.exports = expenseRouter;
