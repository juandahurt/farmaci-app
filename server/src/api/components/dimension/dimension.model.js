const Sequelize = require('sequelize');
const sequelizeDB = require('../../../sequelize');
const Product = require('../product/product.model');

class Dimension extends Sequelize.Model {}
Dimension.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    others: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    units: {
        type: Sequelize.INTEGER,
        allowNull: true
    } 
}, 
{ sequelize: sequelizeDB, modelName: 'dimension' });

Dimension.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = Dimension;