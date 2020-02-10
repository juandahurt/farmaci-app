const Sequelize = require('sequelize');
const sequelizeDB = require('../../../sequelize');
const Provider = require('../provider/provider.model');

class Expense extends Sequelize.Model {}
Expense.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    bill_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    value: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, 
{ sequelize: sequelizeDB, modelName: 'expense' });

Expense.belongsTo(Provider, { foreignKey: 'provider_id' });

module.exports = Expense;