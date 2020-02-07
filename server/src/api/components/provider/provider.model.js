const Sequelize = require('sequelize');
const sequelizeDB = require('../../../sequelize');

class Provider extends Sequelize.Model {}
Provider.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, 
{ sequelize: sequelizeDB, modelName: 'provider' });

module.exports = Provider;