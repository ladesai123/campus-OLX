import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Handle demo users
    if (decoded.userId.startsWith('demo-')) {
      req.user = {
        id: decoded.userId,
        email: decoded.userId.includes('admin') ? 'admin@campusolx.com' : 'demo@university.edu',
        name: 'Demo User',
        university: 'Demo University',
        verified: true,
        admin: decoded.userId.includes('admin')
      };
      return next();
    }

    // Handle real users
    const user = await db.getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.admin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await db.getUserById(decoded.userId);
      req.user = user;
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};