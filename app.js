const express = require('express');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const sequelize = require('./utils/database');
const ExpenseRoute = require('./routers/expenseRouter');
const UserRoute = require('./routers/userRouter');
const Expenses = require('./models/expense');
const User = require('./models/user');

sequelize.sync()
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*"
}));
app.use(express.static('views'));
app.use('/', ExpenseRoute);
app.use('/', UserRoute);
User.hasMany(Expenses);
Expenses.belongsTo(User);

// Define your Razorpay secret key


// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
