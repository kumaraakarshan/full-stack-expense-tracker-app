const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL Configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'node-complete'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database');
});

// API endpoint to save form data
app.post('/api/save-data', (req, res) => {
  const { name, email, phone,password } = req.body;

  const sql = 'INSERT INTO expense (name, email,phone,password ) VALUES (?, ?,?,?)';
  db.query(sql, [name, email,phone,password ], (err, result) => {
    if (err) {
      console.error('Error saving data: ' + err.message);
      res.status(500).json({ error: 'An error occurred while saving data.' });
      return;
    }
    res.json({ message: 'Data saved successfully.' });
  });
});
app.get('/signup', (req, res) => {
  const filePath = path.join(__dirname, 'views', 'signup.html');
  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
