const User = require('../models/user');
const Expense = require('../models/expense');

const PDFDocument = require('pdfkit');
const fs = require('fs');

class ExpenseController {
  static addexpense = async (req, res) => {
    try {
        const {
            amount,
            description,
            category,
            userId 
        } = req.body;


        const user = await User.findById(userId); 
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log('addexpense function executed');
        const expense = new Expense({
            description,
            amount,
            category,
            userId 
        });

        await expense.save();

        const updatedTotalExpense = Number(user.totalExpense) + Number(amount);
        user.totalExpense = updatedTotalExpense;
        await user.save();

        res.status(201).json({ message: 'Expense added successfully' });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ error: 'An error occurred while adding the expense' });
    }
};


  static getexpenses = async (req, res) => {
    const userId = req.params.user; // Get user ID from request params
    // console.log(userId);
    // console.log(req.query);
    const sort = req.query.sort || "ASC";
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 2;

    try {
      const count = await Expense.countDocuments({ userId: userId });
      const expenses = await Expense.find({ userId: userId })
        .sort({ updatedAt: sort })
        .skip((page - 1) * limit)
        .limit(limit);

      res.setHeader('X-Total-Count', count);
      res.status(200).json(expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ error: 'An error occurred while fetching expenses' });
    }
  };

  static deleteexpense = async (req, res) => {
    const { _id } = req.params;
console.log(req.params);
    try {
      const expense = await Expense.findById(_id);
      const user = await User.findById(expense.userId);

      const updatedTotalExpense = Number(user.totalExpense) - Number(expense.amount);
      user.totalExpense = updatedTotalExpense;
      await user.save();

      await Expense.findByIdAndRemove(_id);

      res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
      console.error('Error deleting expense:', error);
      res.status(500).json({ error: 'An error occurred while deleting the expense' });
    }
  };

  static getexpenseById = async (req, res) => {
    const { id } = req.params;

    try {
      const expense = await Expense.findById(id);

      if (!expense) {
        return res.status(404).json({ error: 'Expense not found' });
      }

      res.status(200).json(expense);
    } catch (error) {
      console.error('Error fetching expense:', error);
      res.status(500).json({ error: 'An error occurred while fetching the expense' });
    }
  };

  static updateexpense = async (req, res) => {
    const { id } = req.params;
    const { expenseName, expenseMoney, category, desc } = req.body;

    try {
      const expense = await Expense.findByIdAndUpdate(
        id,
        { expenseName, expenseMoney, category, desc },
        { new: true }
      );

      if (!expense) {
        return res.status(404).json({ error: 'Expense not found' });
      }

      res.status(200).json(expense);
    } catch (error) {
      console.error('Error updating expense:', error);
      res.status(500).json({ error: 'An error occurred while updating the expense' });
    }
  };

  static expensesByGroup = async (req, res, next) => {
    try {
      const data = await Expense.aggregate([
        {
          $group: {
            _id: "$UserId",
            total_amount: { $sum: "$amount" },
          },
        },
      ]);

      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching expenses by group:', error);
      res.status(500).json({ error: 'An error occurred while fetching expenses by group' });
    }
  };

  static exportPdf = async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log(userId);
      const page = req.query.page || 1; // Get the page number from query parameter (default to 1)
      const pageSize = 10; // Set the number of expenses per page

      const expenses = await Expense.find({ userId: userId })
        .skip((page - 1) * pageSize) // Calculate the offset based on the page number
        .limit(pageSize); // Limit the number of expenses per page

      if (expenses.length === 0) {
        return res.status(404).json({ error: 'No expenses found for the user' });
      }

      const doc = new PDFDocument();
      const pdfFilePath = `user_${userId}_expenses.pdf`;
      const writeStream = fs.createWriteStream(pdfFilePath);

      doc.pipe(writeStream);

      doc.fontSize(18).text(`Expenses for User ID: ${userId}`, { align: 'center' });

      // Headers
      const headers = ['Description', 'Amount'];
      const headerText = headers.join(' | ');
      doc.fontSize(12).text(headerText, { underline: true });

      // Table rows
      expenses.forEach((expense) => {
        const rowData = [ expense.description, expense.amount.toString()];
        const rowText = rowData.join(' | ');
        doc.fontSize(12).text(rowText);
      });

      doc.end();

      writeStream.on('finish', () => {
        res.download(pdfFilePath, 'user_expenses.pdf', () => {
          fs.unlinkSync(pdfFilePath); // Remove the PDF file after download
        });
      });
    } catch (error) {
      console.error('Error exporting expenses as PDF:', error);
      res.status(500).json({ error: 'An error occurred while exporting expenses as PDF' });
    }
  };
}

module.exports = ExpenseController;
