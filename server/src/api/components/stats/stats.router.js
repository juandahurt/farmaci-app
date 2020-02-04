const express = require('express');
const statsController = require('./stats.controller');

const statsRouter = express.Router();

/**
 * Ruta que permite obtener las estadísticas
 */
statsRouter.post('/', statsController.get);

module.exports = statsRouter;
