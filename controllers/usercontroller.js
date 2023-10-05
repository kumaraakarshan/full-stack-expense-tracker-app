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

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.json({
          status: 409,
          error: "User already exists.",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const newUser = new User({ name, email, password: hashPassword });

      await newUser.save();

      res.status(201).json({ status: 201, message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (email && password) {
        const user = await User.findOne({ email });

        if (user) {
          const isMatch = await bcrypt.compare(password, user.password);

          if (isMatch) {
            const token = jwt.sign({ userID: user._id }, "jwt-secret-token", {
              expiresIn: "5d",
            });

            return res.status(200).json({
              status: 200,
              message: "Login Success",
              token: token,
              user: user,
            });
          }
        }

        return res.status(500).json({
          status: 500,
          message: "Email or Password is not Valid",
        });
      } else {
        return res.status(500).json({
          status: 500,
          message: "All Fields are Required",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 500,
        message: "Unable to Login",
      });
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

    // Verify payment with your payment gateway API (e.g., Razorpay)
    const isPaymentVerified = await verifyPaymentWithGateway(paymentId);

    if (isPaymentVerified) {
      // Update the premium status
      try {
        const user = await User.findById(id);

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        user.premium = true;
        await user.save();

        // Create a new entry in the "orders" collection with the payment ID and user ID
        const order = new Order({
          userId: id,
          paymentId: paymentId,
          orderid: 'null', // Replace with the actual order ID
        });

        await order.save();

        return res.status(200).json({
          message: 'Payment verified and premium status updated.',
          order: order,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          error: 'Error updating premium status and creating order.',
        });
      }
    } else {
      return res.status(400).json({ error: 'Payment verification failed.' });
    }
  };
  // 
  static getPremiumStatus = async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      const isPremium = user.premium; 
      res.status(200).json({ premium: isPremium });
    } catch (error) {
      console.error('Error fetching premium status:', error);
      res.status(500).json({ error: 'An error occurred while fetching premium status.' });
    }
  };
  static getPremiumLeaderboard = async (req, res) => {
    try {
      const premiumUsers = await User.find({
        premium: true,
      })
        .select('id name premium totalExpense')
        .sort({ totalExpense: 'desc' });

      res.status(200).json(premiumUsers);
    } catch (error) {
      console.error('Error fetching premium leaderboard:', error);
      res.status(500).json({ error: 'An error occurred while fetching premium leaderboard.' });
    }
  };











  static UserWithExpenseDetails = async (req, res, next) => {
    try {
      const usersWithExpenseDetails = await User.aggregate([
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            totalExpense: { $sum: "$totalExpense" },
          },
        },
        {
          $project: {
            _id: 0, // Exclude _id field
            id: "$_id",
            name: 1, // Include name field
            totalExpense: 1, // Include totalExpense field
          },
        },
      ]);

      res.status(200).json(usersWithExpenseDetails);
    } catch (error) {
      console.error('Error fetching user details with expenses:', error);
      res.status(500).json({ error: 'An error occurred while fetching user details with expenses.' });
    }
  };




  
  static updateUserExpenseDetails = async (req, res, next) => {
    const { id } = req.params;
    const { totalExpense } = req.body;

    try {
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.totalExpense = totalExpense;
      await user.save();

      res.status(200).json({ message: 'Total expense updated successfully' });
    } catch (error) {
      console.error('Error updating total expense:', error);
      res.status(500).json({ error: 'An error occurred while updating total expense' });
    }
  };


  static forgotpassword = async (req, res) => {
    const { email } = req.params;

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        const secret = existingUser._id + "jwt-secret-token";
        const token = jwt.sign({ userID: existingUser._id }, secret, {
          expiresIn: "15m",
        });
        const link = `/${existingUser._id}/${token}`;
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "aaku0005nwd@gmail.com",
            pass: "", // Add your email password here
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
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  };

  static userPasswordReset = async (req, res) => {
    const { password, password_confirmation } = req.body;
    const { id, token } = req.params;

    try {
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const new_secret = user._id + "jwt-secret-token";
      jwt.verify(token, new_secret);

      const salt = await bcrypt.genSalt(10);
      const newHashPassword = await bcrypt.hash(password, salt);

      user.password = newHashPassword;
      await user.save();

      res.send({
        status: "success",
        message: "Password Reset Successfully",
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ error: "An error occurred while resetting the password" });
    }
  };
}
module.exports = UserController;
