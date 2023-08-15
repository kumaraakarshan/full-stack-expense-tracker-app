// const sequelize = require('../utils/database');

// // API endpoint to get all expenses
// const getData = (req, res) => {
//   const sql = 'SELECT * FROM expenses';
//   sequelize.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching expenses: ' + err.message);
//       res.status(500).json({ error: 'An error occurred while fetching expenses.' });
//       return;
//     }

//     res.json(results); // Send the retrieved expenses as a JSON response
//   });
// };

// // API endpoint to save form data
// const saveData = (req, res) => {
//   const { amount, description, category } = req.body;
//   const userId = req.signupuser.id; // Corrected property name to "signupuser"
//   const sql = 'INSERT INTO expenses (amount, description, category, userId) VALUES (?, ?, ?, ?)';
//   sequelize.query(sql, [amount, description, category, userId], (err, result) => {
//     if (err) {
//       console.error('Error saving data: ' + err.message);
//       res.status(500).json({ error: 'An error occurred while saving data.' });
//       return;
//     }
//     res.json({ message: 'Data saved successfully.' });
//   });
// };

// // API endpoint to delete an expense by ID
// const deleteData = (req, res) => {
//   const expenseId = req.params.id;
//   const userId = req.signupuser.id; // Corrected property name to "signupuser"
  
//   const checkOwnershipQuery = 'SELECT id FROM expenses WHERE id = ? AND userId = ?';
//   sequelize.query(checkOwnershipQuery, [expenseId, userId], (err, results) => {
//     if (err) {
//       console.error('Error deleting expense: ' + err.message);
//       res.status(500).json({ error: 'An error occurred while deleting expense.' });
//       return;
//     }
//     if (results.length === 0) {
//       // User doesn't own the expense
//       res.status(403).json({ error: "You don't have permission to delete this expense." });
//       return;
//     }

//     const deleteQuery = 'DELETE FROM expenses WHERE id = ?';
//     sequelize.query(deleteQuery, [expenseId], (deleteErr, result) => {
//       if (deleteErr) {
//         console.error('Error deleting expense: ' + deleteErr.message);
//         res.status(500).json({ error: 'An error occurred while deleting expense.' });
//         return;
//       }
//       res.json({ message: 'Expense deleted successfully.' });
//     });
//   });
// };

// module.exports = {
//   getData,
//   saveData,
//   deleteData,
// };
