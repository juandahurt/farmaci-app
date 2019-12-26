const Sequelize = require('sequelize');
const sequelizeDB = require('../../../sequelize');
const Category = require('../category/category.model');

class Product extends Sequelize.Model {}
Product.init({
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    comes_in_boxes: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    comes_in_units: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    comes_in_others: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    box_quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    unit_quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    other_quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    box_price: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    unit_price: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    other_price: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    base_price: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
}, 
{ sequelize: sequelizeDB, modelName: 'product' });

Product.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = Product;