const express = require('express');
const fs =require('fs')
var cors = require('cors')
const helmet = require ('helmet')
const compression =require('compression')
const jwt_decode = require('jwt-decode');
const sequelize = require('./utils/database')
const ExpenseRoute= require('./routers/expenseRouter')
const UserRoute= require('./routers/userRouter')
const Expenses = require('./models/expense')
const User = require('./models/user')
var path = require('path');
const morgan = require('morgan')

const accessLogStream=fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  {flags:'a'}

);
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  })

  const app = express();
  app.use(express.json());
  app.use(cors({
    origin:"*"
  }))
  app.use(express.static('views'));
  app.use('/', ExpenseRoute)
  app.use('/',UserRoute)
  User.hasMany(Expenses);
  Expenses.belongsTo(User)
app.use(helmet());
app.use(compression())
app.use(morgan('combined',{stream:accessLogStream}))



const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
