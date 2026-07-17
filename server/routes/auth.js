// This file handles registration, login, and current-user lookup for JWT-authenticated users.
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');
const storage = require('../storage');

const router = express.Router();

const generateUserId = (role) => {
  const prefix = role === 'EMPLOYEE' ? 'EMP' : role === 'ADMIN' ? 'ADM' : 'STU';
  const suffix = String(Date.now()).slice(-4);
  return `${prefix}-${suffix}`;
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, batchOrDept, validUntil, phone, photo } = req.body;

    if (!name || !email || !password || !role || !batchOrDept) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existingUser = await storage.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await storage.createUser({
      name,
      email,
      password: hashedPassword,
      role,
      batchOrDept,
      validUntil,
      phone,
      photo,
      userId: generateUserId(role),
      qrToken: uuidv4()
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ success: true, token, user });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await storage.findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch user' });
  }
});
router.get('/users', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const users = await storage.getAllUsers();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch users', error: error.message });
  }
});

module.exports = router;
