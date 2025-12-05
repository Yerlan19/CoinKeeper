const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// Register new user (Sequelize)
router.post('/register', async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const userEmail = email || username;
    if (!userEmail || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }
    // Check if user exists
    const exists = await User.findOne({ where: { username: userEmail } });
    if (exists) {
      return res.status(400).json({ error: 'User already exists' });
    }
    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = await User.create({ username: userEmail, password: hashedPassword });
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({
      username: newUser.username,
      user: {
        id: newUser.id,
        name: newUser.username,
        email: newUser.username
      },
      token
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Login user (Sequelize)
router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const userEmail = email || username;
    const user = await User.findOne({ where: { username: userEmail } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const passwordValid = bcrypt.compareSync(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({
      user: {
        id: user.id,
        name: user.username,
        email: user.username
      },
      token
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get current user (protected, Sequelize)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ id: user.id, name: user.username, email: user.username });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// For user list test
router.get('/', async (req, res) => {
  const users = await User.findAll({ attributes: ['id', 'username'] });
  res.json(users);
});

module.exports = router;
