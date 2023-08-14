const db=require('../utils/database');

// API endpoint to get all expenses

const getData=  (req, res) => {
    const userId = req.user.id; 
    const sql = 'SELECT * FROM expenses WHERE userid = ? ';
    db.query(sql, [userId],(err, results) => {
      if (err) {
        console.error('Error fetching expenses: ' + err.message);
        res.status(500).json({ error: 'An error occurred while fetching expenses.' });
        return;
      }
  
      res.json(results); // Send the retrieved expenses as a JSON response
    });
  };

  // API endpoint to save form data
 // In your expenseController.js

const saveData = (req, res) => {
    const userId = req.user.id; // Assuming you've set up proper authentication middleware
    const { amount, description, category } = req.body;
  
    const sql = 'INSERT INTO expenses (amount, description, category, userId) VALUES (?, ?, ?, ?)';
    db.query(sql, [amount, description, category, userId], (err, result) => {
      if (err) {
        console.error('Error saving data: ' + err.message);
        return res.status(500).json({ error: 'An error occurred while saving data.' });
      }
      res.json({ message: 'Data saved successfully.' });
    });
  };
  
  // API endpoint to delete a expense by ID
// In your expenseController.js

const deleteData = (req, res) => {
    const expenseId = req.params.id;
    const userId = req.user.id; // Assuming you've set up proper authentication middleware
  
    const sql = 'DELETE FROM expenses WHERE id = ? AND userId = ?';
    db.query(sql, [expenseId, userId], (err, result) => {
      if (err) {
        console.error('Error deleting expense: ' + err.message);
        return res.status(500).json({ error: 'An error occurred while deleting expense.' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(403).json({ error: 'You do not have permission to delete this expense.' });
      }
  
      res.json({ message: 'Expense deleted successfully.' });
    });
  };
  
  module.exports = {
    getData,
    saveData,
    deleteData,
    
  };
  