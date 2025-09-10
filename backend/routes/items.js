import express from 'express';
import { body, validationResult, query } from 'express-validator';
import multer from 'multer';
import { supabase, db } from '../config/database.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  }
});

// Validation middleware
const validateItemCreation = [
  body('name').trim().isLength({ min: 3, max: 100 }).withMessage('Name must be 3-100 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description max 1000 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isIn(['Books', 'Electronics', 'Furniture', 'Clothing', 'Sports', 'Other']).withMessage('Invalid category'),
];

const validateItemUpdate = [
  body('name').optional().trim().isLength({ min: 3, max: 100 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('price').optional().isFloat({ min: 0 }),
  body('category').optional().isIn(['Books', 'Electronics', 'Furniture', 'Clothing', 'Sports', 'Other']),
];

// Get all items with optional filtering
router.get('/', [
  query('category').optional().isString(),
  query('search').optional().isString(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const filters = {
      category: req.query.category,
      search: req.query.search,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
    };

    const items = await db.getItems(filters);
    
    res.json({
      items,
      total: items.length,
      filters: filters
    });

  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Get single item by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await db.getItemById(id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);

  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Create new item
router.post('/', upload.array('images', 5), validateItemCreation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, category } = req.body;
    const sellerId = req.user.id;

    // Handle image uploads
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileName = `${sellerId}/${Date.now()}_${file.originalname}`;
        
        const { data, error } = await supabase.storage
          .from('item-images')
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            cacheControl: '3600'
          });

        if (error) {
          console.error('Image upload error:', error);
          continue; // Skip this image if upload fails
        }

        const { data: { publicUrl } } = supabase.storage
          .from('item-images')
          .getPublicUrl(fileName);

        imageUrls.push(publicUrl);
      }
    }

    // Create item
    const itemData = {
      name,
      description: description || '',
      price: parseFloat(price),
      category,
      seller_id: sellerId,
      status: 'pending', // Items need admin approval
      images: JSON.stringify(imageUrls)
    };

    const item = await db.createItem(itemData);

    res.status(201).json({
      message: 'Item created successfully and pending approval',
      item
    });

  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Update item (only by seller)
router.put('/:id', validateItemUpdate, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updates = req.body;

    // Check if item exists and user is the seller
    const item = await db.getItemById(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.seller_id !== req.user.id && !req.user.admin) {
      return res.status(403).json({ error: 'Not authorized to update this item' });
    }

    // Update price if provided
    if (updates.price) {
      updates.price = parseFloat(updates.price);
    }

    const updatedItem = await db.updateItem(id, updates);

    res.json({
      message: 'Item updated successfully',
      item: updatedItem
    });

  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete item (only by seller or admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if item exists and user has permission
    const item = await db.getItemById(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.seller_id !== req.user.id && !req.user.admin) {
      return res.status(403).json({ error: 'Not authorized to delete this item' });
    }

    await db.deleteItem(id);

    res.json({ message: 'Item deleted successfully' });

  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Mark item as sold
router.post('/:id/mark-sold', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if item exists and user is the seller
    const item = await db.getItemById(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.seller_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to mark this item as sold' });
    }

    const updatedItem = await db.updateItem(id, { status: 'sold' });

    res.json({
      message: 'Item marked as sold',
      item: updatedItem
    });

  } catch (error) {
    console.error('Mark sold error:', error);
    res.status(500).json({ error: 'Failed to mark item as sold' });
  }
});

// Get user's items
router.get('/user/my-items', async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: items, error } = await supabase
      .from('items')
      .select('*')
      .eq('seller_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ items });

  } catch (error) {
    console.error('Get user items error:', error);
    res.status(500).json({ error: 'Failed to fetch user items' });
  }
});

export default router;