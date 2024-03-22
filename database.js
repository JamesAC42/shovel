const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:admin@localhost:5432/shovel');
module.exports = sequelize;