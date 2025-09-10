import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase, db } from '../config/database.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require admin privileges
router.use(requireAdmin);

// Validation middleware
const validateItemAction = [
  body('message').optional().trim().isLength({ max: 500 }).withMessage('Message too long'),
];

// Get admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    // Get pending items count
    const pendingItems = await db.getPendingItems();
    
    // Get total users
    const allUsers = await db.getAllUsers();
    
    // Get recent activity (simplified for now)
    const { data: recentItems, error: itemsError } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (itemsError) throw itemsError;

    const stats = {
      pendingItems: pendingItems.length,
      totalUsers: allUsers.length,
      verifiedUsers: allUsers.filter(user => user.verified).length,
      totalItems: recentItems.length, // This is just recent, would need proper count
      recentActivity: recentItems.slice(0, 5)
    };

    res.json({ stats });

  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// Get pending items for review
router.get('/items/pending', async (req, res) => {
  try {
    const pendingItems = await db.getPendingItems();
    
    res.json({ items: pendingItems });

  } catch (error) {
    console.error('Get pending items error:', error);
    res.status(500).json({ error: 'Failed to fetch pending items' });
  }
});

// Approve item
router.post('/items/:id/approve', validateItemAction, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { message } = req.body;

    // Check if item exists and is pending
    const item = await db.getItemById(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.status !== 'pending') {
      return res.status(400).json({ error: 'Item is not pending approval' });
    }

    // Approve item
    const updatedItem = await db.updateItem(id, { 
      status: 'approved',
      updated_at: new Date().toISOString()
    });

    // TODO: Send email notification to seller
    // await sendItemApprovalEmail(item.seller.email, item.name, message);

    res.json({
      message: 'Item approved successfully',
      item: updatedItem
    });

  } catch (error) {
    console.error('Approve item error:', error);
    res.status(500).json({ error: 'Failed to approve item' });
  }
});

// Reject item
router.post('/items/:id/reject', validateItemAction, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Rejection reason is required' });
    }

    // Check if item exists and is pending
    const item = await db.getItemById(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.status !== 'pending') {
      return res.status(400).json({ error: 'Item is not pending approval' });
    }

    // Reject item
    const updatedItem = await db.updateItem(id, { 
      status: 'rejected',
      updated_at: new Date().toISOString()
    });

    // TODO: Send email notification to seller
    // await sendItemRejectionEmail(item.seller.email, item.name, message);

    res.json({
      message: 'Item rejected successfully',
      item: updatedItem
    });

  } catch (error) {
    console.error('Reject item error:', error);
    res.status(500).json({ error: 'Failed to reject item' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await db.getAllUsers();
    
    // Remove sensitive information
    const safeUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      university: user.university,
      verified: user.verified,
      admin: user.admin,
      created_at: user.created_at
    }));

    res.json({ users: safeUsers });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Verify user
router.post('/users/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await db.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify user
    const updatedUser = await db.updateUser(id, { 
      verified: true,
      updated_at: new Date().toISOString()
    });

    res.json({
      message: 'User verified successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        verified: updatedUser.verified
      }
    });

  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ error: 'Failed to verify user' });
  }
});

// Make user admin
router.post('/users/:id/make-admin', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await db.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Make user admin
    const updatedUser = await db.updateUser(id, { 
      admin: true,
      verified: true, // Admins should be verified
      updated_at: new Date().toISOString()
    });

    res.json({
      message: 'User promoted to admin successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        admin: updatedUser.admin,
        verified: updatedUser.verified
      }
    });

  } catch (error) {
    console.error('Make admin error:', error);
    res.status(500).json({ error: 'Failed to promote user to admin' });
  }
});

// Get all items (including pending/rejected)
router.get('/items', async (req, res) => {
  try {
    const { status } = req.query;

    let query = supabase
      .from('items')
      .select(`
        *,
        seller:profiles!items_seller_id_fkey(id, email, name, university)
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: items, error } = await query;
    if (error) throw error;

    res.json({ items });

  } catch (error) {
    console.error('Get all items error:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Delete any item (admin privilege)
router.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if item exists
    const item = await db.getItemById(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Delete item
    await db.deleteItem(id);

    res.json({ message: 'Item deleted successfully' });

  } catch (error) {
    console.error('Admin delete item error:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Get platform analytics
router.get('/analytics', async (req, res) => {
  try {
    // This would contain more detailed analytics in a real application
    const analytics = {
      message: 'Analytics endpoint - implement detailed metrics here',
      totalUsers: 0,
      totalItems: 0,
      totalChats: 0,
      activeUsers: 0
    };

    res.json({ analytics });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;