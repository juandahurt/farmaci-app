const Product = require('../product/product.model');
const Notification = require('./notification.model');
const NotificationInfo = require('../notification-info/notification-info.model');
const dateHelper = require('../../helpers/date.helper');
const moment = require('moment');

const notificationController = {
    /**
     * Obtiene las notificaciones
     * @param {object} req - petición del cliente
     * @param {object} res - respuesta del servidor
     */
    async get(req, res) {
        try {
            let products = await Product.findAll();
            var notificationsGenerated = [];

            let notificationInfo = await NotificationInfo.findOne();

            if (notificationInfo) {
                let lastWeek = dateHelper.getLastWeekDate();
                let lastTimeChecked = new Date(notificationInfo.last_time_checked);
                
                if (lastWeek < lastTimeChecked) {
                    let notifications = await Notification.findAll();
                    res.status(200).send(notifications);
                    return;
                }
            }

            await Notification.destroy({
                where: {},
                truncate: true
            });
            await NotificationInfo.destroy({
                where: {},
                truncate: true
            });
            
            products.forEach(async product => {
                // Stock en bodega
                if (product.comes_in_boxes) {
                    if (product.box_quantity == 0) {
                        let productDesc = product.description;
                        let new_notification = await Notification.create({
                            description: `El producto ${productDesc} no tiene cajas en bodega`
                        });
                        notificationsGenerated.push(new_notification);
                    }
                }
                if (!product.comes_in_boxes && product.comes_in_others) {
                    if (product.other_quantity == 0) {
                        let productDesc = product.description;
                        let new_notification = await Notification.create({
                            description: `El producto ${productDesc} no tiene sobres en bodega`
                        });
                        notificationsGenerated.push(new_notification);
                    }
                }
                if (!product.comes_in_boxes && 
                    !product.comes_in_others && 
                    product.comes_in_units) {
                    if (product.unit_quantity == 0) {
                        let productDesc = product.description;
                        let new_notification = await Notification.create({
                            description: `El producto ${productDesc} no tiene unidades en bodega`
                        });
                        notificationsGenerated.push(new_notification);
                    }
                }
                
                // Vencimiento de unidades
                
            });

            await NotificationInfo.create();

            res.status(200).send(notificationsGenerated);
        } catch (err) {
            res.status(500).send({error: err.message});
        }
    },
    /**
     * Elimina una notifiicación
     * @param {object} req - petición del cliente
     * @param {object} res - respuesta del servidor
     */
    async delete(req, res) {
        try {
            let id = req.params.id;

            let n = await Notification.findOne({
                where: {
                    id: id
                }
            });

            await n.destroy();

            res.sendStatus(200);
        } catch (err) {
            res.status(500).send({error: err.message});
        }
    },
    /**
     * Elimina todas las notifiicaciones
     * @param {object} req - petición del cliente
     * @param {object} res - respuesta del servidor
     */
    async deleteAll(req, res) {
        try {
            let id = req.params.id;

            await Notification.destroy({
                where: { },
                truncate: true
            });

            await n.destroy();

            res.sendStatus(200);
        } catch (err) {
            res.status(500).send({error: err.message});
        }
    },
}

module.exports = notificationController;