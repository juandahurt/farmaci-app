const Sequelize = require('sequelize');
const sequelizeDB = require('../../../sequelize');
const Product = require('../product/product.model');

class Unit extends Sequelize.Model {}
Unit.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    others_sold: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    units_sold: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    boxes: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    others: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    units: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    lot: {
        type: Sequelize.STRING,
        allowNull: true
    },
    expires_at: {
        type: Sequelize.DATE,
        allowNull: false
    }
}, 
{ sequelize: sequelizeDB, modelName: 'unit' });

Unit.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = Unit;