const Sequelize = require('sequelize');
const sequelizeDB = require('../../../sequelize');

class NotificationInfo extends Sequelize.Model {}
NotificationInfo.init({
    last_time_checked: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, 
{ sequelize: sequelizeDB, modelName: 'notification-info', freezeTableName: true });

module.exports = NotificationInfo;