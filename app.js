
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const cookieParser = require('cookie-parser'); // For parsing cookies

const port = process.env.PORT || 3000;
app.use(express.static('views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
const signupController=require('./controller/user')
// MySQL Configuration
const db=require('./utils/database');
// API endpoint to save form data
const expenseController=require('./controller/expense')
const { authenticateToken } = require('./controller/authentication'); // Adjust the path accordingly

app.use('/api', authenticateToken); // Apply authentication middleware to all /api routes

app.post('/api/signup',signupController.signup);
app.post('/api/login',signupController.login);

app.get('/api/get-expenses', authenticateToken, expenseController.getData);
app.post(`/api/save-data`,expenseController.saveData);


app.delete(`/api/delete-expense/:id`,expenseController.deleteData);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
