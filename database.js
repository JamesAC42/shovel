const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:admin@localhost:5432/shovel', {
    logging:false
});
module.exports = sequelize;