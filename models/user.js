const mongoose = require('mongoose');
const { NUMBER } = require('sequelize');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String,
        required: true 
    },
    premium: {
        type: Boolean,
        default: false
    },
    totalExpense:{
    type: Number,
    default: false
    }

})

module.exports = mongoose.model('User', userSchema);













// const { Sequelize, DataTypes } = require("sequelize");
// const sequelize = require("../utils/database");
// const User = sequelize.define("User", {
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   premium: {
//     type: DataTypes.BOOLEAN,
//     allowNull: false,
//     defaultValue: false,
//   },
//   totalExpense:{
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     defaultValue: 0,
//   }
// });
// module.exports = User;
