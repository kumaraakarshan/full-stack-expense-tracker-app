const jwt_decode = require('jwt-decode');
const Expenses = require("../models/expense");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const User = require("../models/user");

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
    try {
        const data = await Expenses.findAll({
            where: { userId: userId },
            // ... other query options ...
        });

        res.status(200).json(data); // Send the fetched data to the frontend
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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
}
module.exports = ExpenseController;
