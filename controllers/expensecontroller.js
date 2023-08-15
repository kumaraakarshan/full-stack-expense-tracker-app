const jwt_decode = require('jwt-decode');
const Expenses = require("../models/expense");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const User = require("../models/user");
class ExpenseController {
  static addexpense = async (req, res) => {
    // const t = sequelize.transaction();

    
    const {
      amount,

      description,
      
      category,
     
      UserId,

      UserTotalExpense,
    } = req.body;
    const totalExpense = Number(amount)+ Number(UserTotalExpense);
 
    Expenses.create(
      { description, amount, category,  UserId }
      // { transaction: t }
    )
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        //t.rollback();
        res.status(500).json({ error: error, data: req.body });
      });
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
