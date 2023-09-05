const express = require('express');
const fs =require('fs')
var cors = require('cors')
const mongoose = require('mongoose')
const helmet = require ('helmet')
const compression =require('compression')
const jwt_decode = require('jwt-decode');
// const sequelize = require('./utils/database')
const ExpenseRoute= require('./routers/expenseRouter')
const UserRoute= require('./routers/userRouter')
//const forgotpasswordRoutes = require('./routers/forgotpassword');
// const Expenses = require('./models/expense')
// const User = require('./models/user')
// const ForgotPasswordRequests= require('./models/forgot-password')
var path = require('path');
const morgan = require('morgan')

require('dotenv').config();
const accessLogStream=fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  {flags:'a'}

);
// sequelize.sync()
//   .then(() => {
//     console.log('Database synced successfully.');
//   })
//   .catch((error) => {
//     console.error('Error syncing database:', error);
//   })

  const app = express();
  app.use(express.json());
  app.use(cors({
    origin: "*"
  }))
  app.use(express.static('views'));
  app.use(ExpenseRoute)
  app.use(UserRoute)
  //app.use(forgotpasswordRoutes);
//   User.hasMany(Expenses);
//   Expenses.belongsTo(User)
//   User.hasMany(ForgotPasswordRequests);
// ForgotPasswordRequests.belongsTo(User);
app.use(helmet());
app.use(compression())
app.use(morgan('combined',{stream:accessLogStream}))


mongoose.connect('mongodb+srv://kumaraakarshan:a0xl11nbQpgrkM1H@cluster0.sas6wqa.mongodb.net/?retryWrites=true&w=majority')
.then(result => {
    app.listen(3000)
    console.log('Connected!')
})
.catch(err => {
    console.log(err)
})

