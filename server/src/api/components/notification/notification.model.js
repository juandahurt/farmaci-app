const Sequelize = require('sequelize');
const sequelizeDB = require('../../../sequelize');

class Notification extends Sequelize.Model {}
Notification.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, 
{ sequelize: sequelizeDB, modelName: 'notification' });

module.exports = Notification;