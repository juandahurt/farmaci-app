const express = require('express');
const notificationController = require('./notification.controller');

const notificationRouter = express.Router();

/**
 * Ruta que permite obtener las notificaciones
 */
notificationRouter.get('/', notificationController.get);

/**
 * Ruta que permite eliminar una notificación
 */
notificationRouter.delete('/:id', notificationController.delete);

/**
 * Ruta que permite eliminar todas las notificaciones
 */
notificationRouter.delete('/all', notificationController.deleteAll);

module.exports = notificationRouter;
