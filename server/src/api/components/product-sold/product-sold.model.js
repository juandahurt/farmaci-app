const Sequelize = require('sequelize');
const sequelizeDB = require('../../../sequelize');
const Product = require('../product/product.model');
const Bill = require('../bill/bill.model');

class ProductSold extends Sequelize.Model {}
ProductSold.init({
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    unit_type: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, 
{ sequelize: sequelizeDB, modelName: 'productSold', freezeTableName: true });

ProductSold.belongsTo(Product, { foreignKey: 'product_id' });
ProductSold.belongsTo(Bill, { foreignKey: 'bill_id', primaryKey: 'bill_id' });

module.exports = ProductSold;