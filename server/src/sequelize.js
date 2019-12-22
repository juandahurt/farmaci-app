const db = require('./config/database');
const Sequelize = require('sequelize');

const sequelizeDB = new Sequelize(db.name, db.username, db.password, {
    host: db.host,
    dialect: 'mysql'
});

module.exports = sequelizeDB;