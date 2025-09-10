import express from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../config/database.js';

const router = express.Router();

// Validation middleware
const validateProfile = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('university').optional().trim().isLength({ max: 100 }).withMessage('University name too long'),
];

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        university: user.university,
        verified: user.verified,
        admin: user.admin,
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', validateProfile, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, university } = req.body;
    const userId = req.user.id;

    const updates = {};
    if (name) updates.name = name;
    if (university) updates.university = university;
    updates.updated_at = new Date().toISOString();

    const updatedUser = await db.updateUser(userId, updates);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        university: updatedUser.university,
        verified: updatedUser.verified,
        admin: updatedUser.admin
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user by ID (public info only)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await db.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return only public information
    res.json({
      user: {
        id: user.id,
        name: user.name,
        university: user.university,
        verified: user.verified,
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get user's public items
router.get('/:id/items', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await db.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's approved items
    const items = await db.getItems({ sellerId: id, status: 'approved' });

    res.json({
      items,
      seller: {
        id: user.id,
        name: user.name,
        university: user.university,
        verified: user.verified
      }
    });

  } catch (error) {
    console.error('Get user items error:', error);
    res.status(500).json({ error: 'Failed to fetch user items' });
  }
});

// Delete user account
router.delete('/account', async (req, res) => {
  try {
    const userId = req.user.id;

    // Note: This would need more complex logic in production
    // including handling of active chats, items, etc.
    
    // For now, just mark user as deleted or remove from profiles
    // In production, you'd want to:
    // 1. Archive user's items
    // 2. Close active chats
    // 3. Anonymize user data where required by GDPR
    
    res.json({ 
      message: 'Account deletion requested. Contact admin for complete removal.' 
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

export default router;