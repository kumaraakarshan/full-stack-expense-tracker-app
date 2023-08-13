const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static('views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL Configuration
const db=require('./utils/database');
// API endpoint to save form data
app.post('/api/save-data', (req, res) => {
  const { name, email, phone, password } = req.body;

  // Hash the password
  bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
    if (hashErr) {
      console.error('Error hashing password: ' + hashErr.message);
      res.status(500).json({ error: 'An error occurred while saving data.' });
      return;
    }

    const sql = 'INSERT INTO signupuser (name, email, phone, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, phone, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error saving data: ' + err.message);
        res.status(500).json({ error: 'An error occurred while saving data.' });
        return;
      }
      res.json({ message: 'Data saved successfully.' });
    });
  });
});


app.post("/api/login", (req, res) => {
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
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
