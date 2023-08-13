const bcrypt = require('bcrypt');
const db=require('../utils/database');

const signup=(req, res) => {
    const { name, email, phone, password } = req.body;
  
    // Check if the email already exists
    const checkEmailSql = 'SELECT * FROM signupuser WHERE email = ?';
    db.query(checkEmailSql, [email], (checkErr, checkResults) => {
      if (checkErr) {
        console.error('Error checking email: ' + checkErr.message);
        res.status(500).json({ error: 'An error occurred while saving data.' });
        return;
      }
  
      if (checkResults.length > 0) {
        // Email already exists
        
        res.status(400).json({ error: 'Email already exists.' });
        return;
      }
  
      // Hash the password
      bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          console.error('Error hashing password: ' + hashErr.message);
          res.status(500).json({ error: 'An error occurred while saving data.' });
          return;
        }
  
        const insertSql = 'INSERT INTO signupuser (name, email, phone, password) VALUES (?, ?, ?, ?)';
        db.query(insertSql, [name, email, phone, hashedPassword], (insertErr, result) => {
          if (insertErr) {
            console.error('Error saving data: ' + insertErr.message);
            res.status(500).json({ error: 'An error occurred while saving data.' });
            return;
          }
          res.json({ message: 'Data saved successfully.' });
        });
      });
    });
  };
  
  const login=(req, res) => {
    const { email, password } = req.body;
  
    const sql = 'SELECT * FROM signupuser WHERE email = ?';
    db.query(sql, [email], (err, results) => {
      if (err) {
        console.log('Error fetching user data: ' + err.message);
        res.status(500).json({ error: 'An error occurred while fetching user data.' });
        return;
      }
  
      if (results.length === 0) {
        // User not found
        res.status(401).json({ message: "Login failed" });
        return;
      }
  
      const user = results[0];
      bcrypt.compare(password, user.password, (bcryptErr, bcryptResult) => {
        if (bcryptErr || !bcryptResult) {
          
          res.status(401).json({ message: "Login failed" });
        } else {
   
          res.status(200).json({ message: "Login successful" });
        }
      });
    });
  };

  module.exports = {
    signup,
    login
  };