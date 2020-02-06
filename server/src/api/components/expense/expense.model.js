const Sequelize = require('sequelize');
const sequelizeDB = require('../../../sequelize');

class Expense extends Sequelize.Model {}
Expense.init({
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
{ sequelize: sequelizeDB, modelName: 'expense' });


module.exports = Expense;