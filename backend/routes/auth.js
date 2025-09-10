import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabase, db } from '../config/database.js';

const router = express.Router();

// Validation middleware
const validateRegistration = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('university').optional().trim().isLength({ max: 100 }),
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
];

// Helper function to generate JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Helper function to check university email
const isUniversityEmail = (email) => {
  return email.endsWith('.edu') || email.includes('university') || email.includes('college');
};

// Register new user
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, university } = req.body;

    // Check if university email
    if (!isUniversityEmail(email)) {
      return res.status(400).json({ 
        error: 'University email required (.edu domain)' 
      });
    }

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) {
      console.error('Supabase auth error:', authError);
      return res.status(400).json({ error: authError.message });
    }

    // Create user profile
    const userData = {
      id: authData.user.id,
      email,
      name,
      university: university || 'Unknown University',
      verified: false,
      admin: email === process.env.ADMIN_EMAIL
    };

    const user = await db.createUser(userData);

    // Generate JWT token
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        university: user.university,
        verified: user.verified,
        admin: user.admin
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Sign in with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get user profile
    const user = await db.getUserById(authData.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        university: user.university,
        verified: user.verified,
        admin: user.admin
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Google OAuth callback
router.post('/google', async (req, res) => {
  try {
    const { credential, email, name } = req.body;

    if (!email || !isUniversityEmail(email)) {
      return res.status(400).json({ 
        error: 'University email required (.edu domain)' 
      });
    }

    // Check if user exists
    let user = await db.getUserByEmail(email);

    if (!user) {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true
      });

      if (authError) {
        console.error('Supabase auth error:', authError);
        return res.status(400).json({ error: authError.message });
      }

      // Create user profile
      const userData = {
        id: authData.user.id,
        email,
        name: name || email.split('@')[0],
        university: email.split('@')[1] || 'Unknown University',
        verified: true, // Google OAuth users are pre-verified
        admin: email === process.env.ADMIN_EMAIL
      };

      user = await db.createUser(userData);
    }

    // Generate JWT token
    const token = generateToken(user.id);

    res.json({
      message: 'Google login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        university: user.university,
        verified: user.verified,
        admin: user.admin
      },
      token
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

// Verify token
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.getUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        university: user.university,
        verified: user.verified,
        admin: user.admin
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(403).json({ error: 'Invalid token' });
  }
});

// Logout (mainly for cleanup)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

export default router;