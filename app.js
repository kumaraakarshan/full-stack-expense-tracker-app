const express = require('express');
var cors = require('cors')

const jwt_decode = require('jwt-decode');
const sequelize = require('./utils/database')
const ExpenseRoute= require('./routers/expenseRouter')
const UserRoute= require('./routers/userRouter')
const Expenses = require('./models/expense')
const User = require('./models/user')
var path = require('path');

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

// app.get('/', (req, res) => {
//   const indexfile = path.join(currentDirPath, '/views/index.html')
//   res.sendFile(indexfile);
// });

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
