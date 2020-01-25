const Sequelize = require('sequelize');
const sequelizeDB = require('../../../sequelize');

class Bill extends Sequelize.Model {}
Bill.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
}, 
{ sequelize: sequelizeDB, modelName: 'bill' });

module.exports = Bill;