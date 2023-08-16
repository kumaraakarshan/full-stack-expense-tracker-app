const UserController = require("../controllers/usercontroller");
const express = require("express");
const router = express.Router();
const checkUser = require("../middleware/alreadyexist");
// router.use("register", checkUser);
router.post("/signup", UserController.RegisterUser);
router.post('/login', UserController.userLogin)
router.get("/users", UserController.getUsers);
router.delete("/delete-user/:id", UserController.deleteUser);
router.get("/user/:email", UserController.getUserByEmail);
router.post('/update/:id', UserController.updatePremiumStatus)
router.get('/get-premium-status/:userId', UserController.getPremiumStatus);
router.get('/UserWithExpenseDetails', UserController.UserWithExpenseDetails)
router.patch('/UserWithExpenseDetails/:id', UserController.updateUserExpenseDetails)
router.post('/password/forgotpassword/:email', UserController.forgotpassword)
router.patch('/resetpassword/:id/:token', UserController.userPasswordReset)
module.exports = router;
