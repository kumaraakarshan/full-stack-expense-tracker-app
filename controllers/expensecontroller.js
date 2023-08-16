const jwt_decode = require('jwt-decode');
const Expenses = require("../models/expense");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const User = require("../models/user");
const PDFDocument = require('pdfkit');
const fs = require('fs');
class ExpenseController {
  static addexpense = async (req, res) => {
    try {
        const {
            amount,
            description,
            category,
            UserId
        } = req.body;

        const user = await User.findByPk(UserId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const expense = await Expenses.create({
            description,
            amount,
            category,
            UserId
        });

        const updatedTotalExpense = Number(user.totalExpense )+ Number (amount);
        await user.update({ totalExpense: updatedTotalExpense });

        res.status(201).json({ message: 'Expense added successfully' });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ error: 'An error occurred while adding the expense' });
    }
};
  static getexpenses = async (req, res) => {
    
    const userId = req.params.user; // Get user ID from request params
console.log(req.query);
    const sort = req.query.sort || "ASC";
   const page = +req.query.page  || 1;
    const limit = +req.query.limit || 2;
    const data = await Expenses.findAll({
      offset: (+page - 1) * limit,
      limit: +limit,
      where: { userId: userId },
      order: [["updatedAt", sort]],
    })
      .then((result) => {
        
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
};

  static deleteexpense = async (req, res) => {
    const { id } = req.params;
    
    const expense = await Expenses.findByPk(id);
    const user = await User.findByPk(expense.UserId);
    const updatedTotalExpense = Number(user.totalExpense) - Number(expense.amount);
    await user.update({ totalExpense: updatedTotalExpense });
    Expenses.destroy({ where: { id: id } })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  };
  static getexpenseById = async (req, res) => {
    const { id } = req.params;

    
    Expenses.findOne({ where: { id: id } })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };
  static updateexpense = async (req, res) => {
    const { id } = req.params;

    const { expenseName, expenseMoney, category, desc } = req.body;
    Expenses.update(
      { expenseName, expenseMoney, category, desc },
      { where: { id: id } }
    )
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  };
  static expensesByGroup = async (req, res, next) => {
    const { user } = req.params;
    const data = await Expenses.findAll({
      attributes: [
        "userId",
        [Sequelize.fn("sum", Sequelize.col("expenseMoney")), "total_amount"],
      ],
      group: ["userId"],
    })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  };



  static exportPdf = async (req, res) => {
    try {
      const userId = req.params.userId;
      const page = req.query.page || 1; // Get the page number from query parameter (default to 1)
      const pageSize = 10; // Set the number of expenses per page
  
      const expenses = await Expenses.findAll({
        where: { UserId: userId },
        offset: (page - 1) * pageSize, // Calculate the offset based on the page number
        limit: pageSize, // Limit the number of expenses per page
      });
  
      if (expenses.length === 0) {
        return res.status(404).json({ error: 'No expenses found for the user' });
      }
  
      const doc = new PDFDocument();
      const pdfFilePath = `user_${userId}_expenses.pdf`;
      const writeStream = fs.createWriteStream(pdfFilePath);
  
      doc.pipe(writeStream);
  
      doc.fontSize(18).text(`Expenses for User ID: ${userId}`, { align: 'center' });
  
      // Headers
      const headers = ['Date', 'Description', 'Amount'];
      const headerText = headers.join(' | ');
      doc.fontSize(12).text(headerText, { underline: true });
  
      // Table rows
      expenses.forEach((expense) => {
        const rowData = [expense.date, expense.description, expense.amount.toString()];
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
