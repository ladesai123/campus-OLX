import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase, db } from '../config/database.js';

const router = express.Router();

// Validation middleware
const validateChatCreation = [
  body('itemId').isUUID().withMessage('Valid item ID required'),
  body('sellerId').isUUID().withMessage('Valid seller ID required'),
];

const validateMessage = [
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be 1-1000 characters'),
];

// Get user's chats
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const chats = await db.getUserChats(userId);
    
    // Format chats for frontend
    const formattedChats = chats.map(chat => {
      const isUserBuyer = chat.buyer_id === userId;
      const otherUser = isUserBuyer ? chat.seller : chat.buyer;
      const lastMessage = chat.messages.length > 0 
        ? chat.messages[chat.messages.length - 1] 
        : null;

      return {
        id: chat.id,
        item: chat.item,
        otherUser: {
          id: otherUser.id,
          name: otherUser.name,
          email: otherUser.email
        },
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          created_at: lastMessage.created_at,
          sender_id: lastMessage.sender_id
        } : null,
        created_at: chat.created_at,
        messageCount: chat.messages.length
      };
    });

    res.json({ chats: formattedChats });

  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// Get specific chat with messages
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const chat = await db.getChatById(id);
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Check if user is part of this chat
    if (chat.buyer_id !== userId && chat.seller_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to view this chat' });
    }

    // Format chat for frontend
    const isUserBuyer = chat.buyer_id === userId;
    const otherUser = isUserBuyer ? chat.seller : chat.buyer;

    const formattedChat = {
      id: chat.id,
      item: chat.item,
      otherUser: {
        id: otherUser.id,
        name: otherUser.name,
        email: otherUser.email
      },
      messages: chat.messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender_id: msg.sender_id,
        sender: msg.sender,
        created_at: msg.created_at,
        isOwnMessage: msg.sender_id === userId
      })),
      created_at: chat.created_at
    };

    res.json({ chat: formattedChat });

  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
});

// Create new chat
router.post('/', validateChatCreation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { itemId, sellerId } = req.body;
    const buyerId = req.user.id;

    // Prevent user from creating chat with themselves
    if (buyerId === sellerId) {
      return res.status(400).json({ error: 'Cannot create chat with yourself' });
    }

    // Check if item exists
    const item = await db.getItemById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Check if chat already exists for this item and users
    const { data: existingChats, error: checkError } = await supabase
      .from('chats')
      .select('id')
      .eq('item_id', itemId)
      .eq('buyer_id', buyerId)
      .eq('seller_id', sellerId);

    if (checkError) throw checkError;

    if (existingChats && existingChats.length > 0) {
      return res.status(409).json({ 
        error: 'Chat already exists',
        chatId: existingChats[0].id 
      });
    }

    // Create new chat
    const chatData = {
      item_id: itemId,
      buyer_id: buyerId,
      seller_id: sellerId
    };

    const chat = await db.createChat(chatData);

    res.status(201).json({
      message: 'Chat created successfully',
      chat: {
        id: chat.id,
        item_id: itemId,
        created_at: chat.created_at
      }
    });

  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

// Send message in chat
router.post('/:id/messages', validateMessage, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id: chatId } = req.params;
    const { content } = req.body;
    const senderId = req.user.id;

    // Check if chat exists and user is part of it
    const chat = await db.getChatById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (chat.buyer_id !== senderId && chat.seller_id !== senderId) {
      return res.status(403).json({ error: 'Not authorized to send messages in this chat' });
    }

    // Create message
    const messageData = {
      chat_id: chatId,
      sender_id: senderId,
      content: content.trim()
    };

    const message = await db.createMessage(messageData);

    // Emit real-time message (handled by socket.io in server.js)
    req.app.get('io').to(chatId).emit('new_message', {
      id: message.id,
      content: message.content,
      sender_id: message.sender_id,
      sender: message.sender,
      created_at: message.created_at,
      chat_id: chatId
    });

    res.status(201).json({
      message: 'Message sent successfully',
      data: {
        id: message.id,
        content: message.content,
        sender_id: message.sender_id,
        sender: message.sender,
        created_at: message.created_at
      }
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Delete chat (only if no messages or user is admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if chat exists and user is part of it
    const chat = await db.getChatById(id);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (chat.buyer_id !== userId && chat.seller_id !== userId && !req.user.admin) {
      return res.status(403).json({ error: 'Not authorized to delete this chat' });
    }

    // Check if chat has messages (prevent deletion if it does, unless admin)
    if (chat.messages.length > 0 && !req.user.admin) {
      return res.status(400).json({ 
        error: 'Cannot delete chat with messages' 
      });
    }

    // Delete chat (this will cascade delete messages)
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Chat deleted successfully' });

  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

export default router;