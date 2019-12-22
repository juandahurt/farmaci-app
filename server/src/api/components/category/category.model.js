const Sequelize = require('sequelize');
const sequelizeDB = require('../../../sequelize');

class Category extends Sequelize.Model {}
Category.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    } 
}, 
{ sequelize: sequelizeDB, modelName: 'category' });

module.exports = Category;