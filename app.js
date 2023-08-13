const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static('views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const signupController=require('./controller/user')
// MySQL Configuration
const db=require('./utils/database');
// API endpoint to save form data
// API endpoint to save form data


app.post('/api/save-data',signupController.signup);
app.post('/api/login',signupController.login);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
