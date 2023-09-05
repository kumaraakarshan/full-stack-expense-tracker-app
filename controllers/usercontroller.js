const User = require("../models/user");

const axios = require('axios');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Order = require('../models/order');
const nodemailer = require("nodemailer");
const mailgen = require("mailgen");
const verifyPaymentWithGateway = require('../utils/paymentVerification');
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
    const { paymentId } = req.body;

    // Verify payment with Razorpay API
    const isPaymentVerified = await verifyPaymentWithGateway(paymentId);

    if (isPaymentVerified) {
        // Update the premium status
        try {
            await User.update({ premium: true }, { where: { id: id } });

            // Create a new entry in the "orders" table with the payment ID and user ID
            const order = await Order.create({
                id: id,
                paymentid: paymentId,
                orderid: 'null' // Replace with the actual order ID
            });

            res.status(200).json({ message: 'Payment verified and premium status updated.', order });
        } catch (error) {
            res.status(500).json({ error: 'Error updating premium status and creating order.' });
        }
    } else {
        res.status(400).json({ error: 'Payment verification failed.' });
    }
};

static getPremiumStatus= async(req, res) =>{
  const { userId } = req.params;

  try {
      const user = await User.findByPk(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found.' });
      }

      const isPremium = user.premium; // Assuming you have a "premium" field in the User model
      res.status(200).json({ premium: isPremium });
  } catch (error) {
      console.error('Error fetching premium status:', error);
      res.status(500).json({ error: 'An error occurred while fetching premium status.' });
  }
}
static getPremiumLeaderboard = async (req, res) => {
  try {
    const premiumUsers = await User.findAll({
      attributes: ['id', 'name', 'premium','totalExpense'],
      where: { premium: true },
      include: [
        {
          model: Expense,
          attributes: [],
          required: false,
          where: { UserId: Sequelize.col('User.id') },
        },
      ],
      users: [[Sequelize.literal('totalExpense'), 'DESC']], 
    });

    res.status(200).json(premiumUsers);
  } catch (error) {
    console.error('Error fetching premium leaderboard:', error);
    res.status(500).json({ error: 'An error occurred while fetching premium leaderboard.' });
  }
}











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

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.update({ totalExpense: totalExpense });

        res.status(200).json({ message: 'Total expense updated successfully' });
    } catch (error) {
        console.error('Error updating total expense:', error);
        res.status(500).json({ error: 'An error occurred while updating total expense' });
    }
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
          user: "aaku0005nwd@gmail.com", 
          pass: "7870840998",
        },
      });

      const mailOptions = {
        from: "aaku0005nwd@gmail.com",
        to: existingUser.email,
        subject: "Password Reset Request",
        html: `
          <p>Hello,</p>
          <p>We received a request to reset your password. Click the link below to reset it.</p>
          <a href="${link}">Reset Password</a>
          <p>If you didn't request a password reset, please ignore this email.</p>
        `,
      };


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
