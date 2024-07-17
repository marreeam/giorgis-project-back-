const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { validateEmail, validateUsername, validatePassword } = require('../utils/validators');
const { sendVerificationEmail, sendConfirmationEmail } = require('../utils/emailService');
const crypto = require('crypto'); // Ensure this line is present

const router = express.Router();

// Secret keys for JWT
const ACCESS_TOKEN_SECRET = '6ca6f1537279dd0dd9f483e227fdfb3c2525c26d122ab86f357000700863548553d62edd56d27825030284ba9c8c2ef54eb454cb41fcabb505a41c5eb37975cd';
const REFRESH_TOKEN_SECRET = '6910ec77f64a197bff2c34fca05d964f17e22302a3ded28699177aa3a125646ad22f444dcf80fdffec0a3a1823e2b54412ca3f53d920ece3f77973f152c2f84d';

// Helper function to generate access tokens
const generateAccessToken = (user) => {
  return jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
};

// Helper function to generate refresh tokens
const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '1y' });
};

// Registration Route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validate email
    let validationResult = validateEmail(email);
    if (!validationResult.valid) {
      return res.status(400).json({ msg: validationResult.msg });
    }

    // Validate username
    validationResult = validateUsername(username);
    if (!validationResult.valid) {
      return res.status(400).json({ msg: validationResult.msg });
    }

    // Validate password
    validationResult = validatePassword(password);
    if (!validationResult.valid) {
      return res.status(400).json({ msg: validationResult.msg });
    }

    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }
    let userN = await User.findOne({ where: { username } });
    if (userN) {
      return res.status(400).json({ msg: 'User with this username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create new user
    user = await User.create({
      username,
      email,
      password: hashedPassword,
      verificationToken
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ msg: 'User registered successfully. Please check your email to verify your account.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Email Verification Route
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;

  try {
    // Find user by verification token
    const user = await User.findOne({ where: { verificationToken: token } });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired verification token' });
    }

    // Verify user
    user.isVerified = true;
    user.verificationToken = null; // Clear the verification token
    await user.save();

    // Send confirmation email
    await sendConfirmationEmail(user.email);

    res.status(200).json({ msg: 'Email verified successfully. A confirmation email has been sent.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    if (!user.isVerified) {
      return res.status(400).json({ msg: 'Please verify your email before logging in' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({ 
      msg: 'User logged in successfully', 
      accessToken,
      refreshToken
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Refresh Token Route
router.post('/token', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);

    // Find the user
    const user = await User.findByPk(decoded.userId);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ msg: 'Invalid refresh token' });
    }

    // Generate a new access token
    const accessToken = generateAccessToken(user);

    res.status(200).json({ accessToken });
  } catch (err) {
    console.error(err.message);
    res.status(403).json({ msg: 'Invalid refresh token' });
  }
});

module.exports = router;


