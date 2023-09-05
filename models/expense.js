

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const expenseSchema = new Schema({
  date:{
    type: Date,
    default: true
  },
  description: {
    type: String,
    required: true
},
    amount: {
        type: Number,
        required: true
    },
   
    category: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Expense', expenseSchema);













// const { Sequelize, DataTypes } = require("sequelize");
// const sequelize = require("../utils/database");

// const Expenses = sequelize.define("expense", {
//   date: {
//     type: DataTypes.DATE,
//     allowNull: false,
//     defaultValue: new Date(),
//   },
//   description: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   amount: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   category: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   }

// });
//module.exports = Expenses;
