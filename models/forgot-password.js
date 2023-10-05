const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forgotPasswordSchema = new Schema({
    active: { type: Boolean },
    expiresBy: { type: Date }
})

module.exports = mongoose.model('ForgotPassword', forgotPasswordSchema);
















// const Sequelize=require('sequelize')
// const sequelize=require('../utils/database')
// const ForgotPasswordRequests = sequelize.define('forgotpasswordrequests',{
//     sl:{
//       type: Sequelize.INTEGER,
//       autoIncrement: true,
//       unique: true,
//       primaryKey: true,
//       allowNull: false,
    
      
//     },
//     id:{
//         type: Sequelize.INTEGER,
//         unique:true,
//         allowNull:false
//     },
//     // userId:{ 
//     //   type: Sequelize.INTEGER,
//     //   allowNull: false
//     // },
//     isActive:{
//       type: Sequelize.BOOLEAN,
//       allowNull: false
//     }
  
//   });
//   module.exports = ForgotPasswordRequests;