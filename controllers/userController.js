// API Controllers for User
const bcrypt = require('bcrypt');
const moment = require('moment-timezone');
const User = require('../models/user');

const saltRounds = 10;

// Sign up function
exports.signup = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Set created_at in GMT+8
      const createdAtGMT8 = moment().tz("Asia/Singapore").toDate();
  
      const user = await User.create({ 
        username, 
        email, 
        password,
        created_at: createdAtGMT8 // Explicitly set created_at
      });
      
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  };
  
  // Login function
  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Set last_login in GMT+8
      const lastLoginGMT8 = moment().tz("Asia/Singapore").toDate();
      user.last_login = lastLoginGMT8;
      await user.save();
  
      // Successful login response
      res.json({
        message: 'Login successful',
        user: {
          userId: user.user_id,
          username: user.username,
          email: user.email,
          last_login: user.last_login // Send updated login time in response
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
  };
  
  // Update profile function
  exports.updateProfile = async (req, res) => {
    try {
      const { email, username, password } = req.body;
  
      if (!email) {
        return res.status(400).json({ message: 'Email is required to identify the user' });
      }
  
      // Find the user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Prepare fields to update
      const updateFields = {};
      if (username) updateFields.username = username;
      if (password) updateFields.password = await bcrypt.hash(password, saltRounds);
  
      // Update user profile with provided fields
      await User.update(updateFields, { where: { email } });
  
      res.json({ message: 'Profile updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error });
    }
  };