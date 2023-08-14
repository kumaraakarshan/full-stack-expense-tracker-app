const db=require('../utils/database');

// API endpoint to get all expenses

const getData=  (req, res) => {
    const sql = 'SELECT * FROM expense';
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching expenses: ' + err.message);
        res.status(500).json({ error: 'An error occurred while fetching expenses.' });
        return;
      }
  
      res.json(results); // Send the retrieved expenses as a JSON response
    });
  };

  // API endpoint to save form data
const saveData=  (req, res) => {
    const { amount, description, category } = req.body;
  
    const sql = 'INSERT INTO expense (amount, description, category ) VALUES (?, ?, ?)';
    db.query(sql, [amount, description, category ], (err, result) => {
      if (err) {
        console.error('Error saving data: ' + err.message);
        res.status(500).json({ error: 'An error occurred while saving data.' });
        return;
      }
      res.json({ message: 'Data saved successfully.' });
    });
  };
  
  // API endpoint to delete a expense by ID
  const deleteData = (req, res) => {
    const expenseId = req.params.id;
  
    const sql = 'DELETE FROM expense WHERE id = ?';
    db.query(sql, [expenseId], (err, result) => {
      if (err) {
        console.error('Error deleting expense: ' + err.message);
        res.status(500).json({ error: 'An error occurred while deleting expense.' });
        return;
      }
  
      res.json({ message: 'expense deleted successfully.' });
    });
  };
  module.exports = {
    getData,
    saveData,
    deleteData,
    
  };
  