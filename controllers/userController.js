// API Controllers for User
const bcrypt = require('bcrypt');
const moment = require('moment-timezone');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'key.env' });

// Server side secret key
const JWT_SECRET = process.env.JWT_SECRET;
// Token expiry time
const TOKEN_EXPIRATION = '1h'; 
// No of Hashing rounds
const saltRounds = 10;

// Signup function
exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email is already registered' });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Set created_at in GMT+8
        const createdAtGMT8 = moment().tz("Asia/Singapore").format();

        // Create the user with the hashed password and created_at timestamp
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            created_at: createdAtGMT8
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.user_id, email: user.email }, // Payload
            JWT_SECRET, // Secret key
            { expiresIn: TOKEN_EXPIRATION } // Token expiration time
        );
        
        // Successful response (excluding password)
        res.status(200).json({
            message: 'User registered successfully',
            token,
            user: {
                userId: user.user_id,
                username: user.username,
                email: user.email,
                created_at: createdAtGMT8,
            }
        });
    } catch (error) {
        console.error('Error creating user:', error); // Log the actual error for debugging
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

// Login function
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Log email and password being used
        console.log("Login attempt with email:", email);

        const user = await User.findOne({ where: { email } });

        // Check if user exists
        if (!user) {
            console.log("User not found with email:", email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log("Invalid password for email:", email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Set last_login in GMT+8
        const lastLoginGMT8 = moment().tz("Asia/Singapore").format();
        user.last_login = lastLoginGMT8;

        // Attempt to save the user object with the updated last_login field
        try {
            await user.save();
            console.log("Last login time saved:", lastLoginGMT8); // Log successful save
        } catch (saveError) {
            console.error("Error saving last_login:", saveError);
            return res.status(500).json({ message: 'Failed to save last login time', error: saveError });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.user_id, email: user.email }, // Payload
            JWT_SECRET, // Secret key
            { expiresIn: TOKEN_EXPIRATION } // Token expiration time
        );

        // Successful login response with token
        res.json({
            message: 'Login successful',
            token, // Send token in response
            user: {
                userId: user.user_id,
                username: user.username,
                email: user.email,
                last_login: lastLoginGMT8 // Send updated login time in response
            }
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Error logging in', error });
    }
};

// Forget password function 
exports.forgetPass = async (req, res) => {
    try {
        const { email, password } = req.body;

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
        if (password) updateFields.password = await bcrypt.hash(password, saltRounds);

        // Update user profile with provided fields
        await User.update(updateFields, { where: { email } });

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating password', error });
    }
};