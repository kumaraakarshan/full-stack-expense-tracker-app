const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const Expenses = sequelize.define("expense", {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date(),
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  }

});
module.exports = Expenses;
