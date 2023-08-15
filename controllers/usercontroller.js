const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mailgen = require("mailgen");
var path = require('path');
const { Sequelize, DataTypes } = require("sequelize");
const Expense = require("../models/expense");

class UserController {
  static RegisterUser = async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.json({
        status: 409,
        error: "User already exists.",
        // user: existingUser,
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      User.create({ name, email, password: hashPassword })
        .then((result) => {
          res
            .status(201)
            .json({ status: 201, message: "User registered successfully" });
        })
        .catch((error) => {
          res.status(500).json({ error: error });
        });
    }
  };
  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await User.findOne({ where: { email } });
        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password);
          console.log("Provided Email:", email);
          console.log("Retrieved User:", user);
          if (user.email === email && isMatch) {
            console.log("Email and Password Match");
            const token = jwt.sign({ userID: user.id }, "jwt-secret-token", {
              
              expiresIn: "5d",
              
            });
            //console.log('*********'+token);
            res.send({
              status: 200,
              message: "Login Success",
              token: token,
              user: user,
            });
          } else {
            res.send({
              status: 500,
              message: "Email or Password is not Valid",
            });
          }
        } else {
          res.send({
            status: 500,
            message: "You are not a Registered User",
          });
        }
      } else {
        res.send({ status: "500", message: "All Fields are Required" });
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "500", message: "Unable to Login" });
    }
  };
  static getUsers = async (req, res) => {
    const data = await User.findAll()
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  };
  static deleteUser = async (req, res) => {
    const { id } = req.params;
    User.destroy({ where: { id: id } })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  };
  static getUserByEmail = async (req, res) => {
    const { email } = req.params;
    User.findOne({ where: { email: email } })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };
  static updatePremiumStatus = async (req, res) => {
    const { id } = req.params;
    User.update({ premium: true }, { where: { id: id } })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };
  static UserWithExpenseDetails = async (req, res, next) => {
    const { user } = req.params;
    const data = await User.findAll({
 
      attributes: ["id", "name", "totalExpense"],
      group: ["id"],
    })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  };
  static updateUserExpenseDetails = async (req, res, next) => {
    const { id } = req.params;
    const { totalExpense } = req.body;
    console.log(req.body);
    User.update({ totalExpense: totalExpense }, { where: { id: id } })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  };
  static forgotpassword = async (req, res) => {
    const { email } = req.params;
    // console.log(req.params);
    const existingUser = await User.findOne({ where: { email } });
   
    if (existingUser) {
      const secret = existingUser.id + "jwt-secret-token";
      const token = jwt.sign({ userID: existingUser.id }, secret, {
        expiresIn: "15m",
      });
      const link = `http://127.0.0.1:3000/resetpassword/${existingUser.id}/${token}`;
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "aakarshan0005@gmail.com", 
          pass: "jjakxuuduudiywaz",
        },
      });
  








      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error("Error sending email:", error);
          return res
            .status(500)
            .json({ success: false, message: "Failed to send email" });
        }
        res
          .status(200)
          .json({ success: true, message: "Email sent successfully" });
      });
    } else {
      res.send("user not found");
    }
  };
  static userPasswordReset = async (req, res) => {
    const { password, password_confirmation } = req.body;
    const { id, token } = req.params;
    const user = await User.findOne({ where: { id: id } });
    const new_secret = user.id + "jwt-secret-token";
    try {
      jwt.verify(token, new_secret);

      const salt = await bcrypt.genSalt(10);
      const newHashPassword = await bcrypt.hash(password, salt);
      await User.update({ password: newHashPassword }, { where: { id: id } });
      res.send({
        status: "success",
        message: "Password Reset Successfully",
      });
    } catch (error) {
      console.log(error);
      res.send({ status: "failed", message: "Invalid Token" });
    }
  };
}
module.exports = UserController;
