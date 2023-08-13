// controllers/signupController.js
const db = require('../utils/database');

exports.signUp = (req, res) => {
  const { name, email, phone, password } = req.body;
  // Perform validation and check if the email is already registered

  const sql = 'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)';
  const values = [name, email, phone, password];

  db.query(sql, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    } else {
      res.status(201).json({ message: 'User registered successfully' });
    }
  });
};
