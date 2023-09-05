const ExpenseController = require("../controllers/expensecontroller");
const express = require("express");
const router = express.Router();
//sconst authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/user");
router.post("/add-expense", ExpenseController.addexpense);
router.get("/expenses/:user", ExpenseController.getexpenses);
router.delete("/delete-expense/:id", ExpenseController.deleteexpense);
router.get("/expense/:id", ExpenseController.getexpenseById);
router.put("/update-expense/:id", ExpenseController.updateexpense);
router.get("/expenseByGroup", ExpenseController.expensesByGroup);


router.get("/export-expenses-pdf/:userId", ExpenseController.exportPdf);
module.exports = router;
