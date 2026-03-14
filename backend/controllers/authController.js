const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// REGISTER
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                message: '❌ Please fill all fields'
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                message: '❌ User already exists'
            });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                message: '✅ Registration successful'
            });
        }

     } catch (error) {
        console.log('Register Error Full:', error);
        console.log('Error Name:', error.name);
        console.log('Error Message:', error.message);
        return res.status(500).json({
            message: '❌ Server error',
            error: error.message,
            errorName: error.name
        });
    }
};

// LOGIN
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                message: '❌ Please fill all fields'
            });
        }

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                message: '✅ Login successful'
            });
        } else {
            return res.status(401).json({
                message: '❌ Invalid email or password'
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: '❌ Server error',
            error: error.message
        });
    }
};

// GET PROFILE
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email
            });
        } else {
            return res.status(404).json({
                message: '❌ User not found'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: '❌ Server error',
            error: error.message
        });
    }
};

module.exports = { registerUser, loginUser, getUserProfile };
