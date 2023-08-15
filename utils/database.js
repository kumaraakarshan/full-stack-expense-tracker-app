
const { Sequelize, DataTypes } = require('sequelize');


const sequelize = new Sequelize('expense', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql',
});




module.exports = sequelize;
