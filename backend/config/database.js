import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Database helper functions
export const db = {
  // Users
  async createUser(userData) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserById(id) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
  },

  async updateUser(id, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Items
  async getItems(filters = {}) {
    let query = supabase
      .from('items')
      .select(`
        *,
        seller:profiles!items_seller_id_fkey(id, email, name, university)
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getItemById(id) {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        seller:profiles!items_seller_id_fkey(id, email, name, university)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createItem(itemData) {
    const { data, error } = await supabase
      .from('items')
      .insert([itemData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateItem(id, updates) {
    const { data, error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteItem(id) {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Chats
  async createChat(chatData) {
    const { data, error } = await supabase
      .from('chats')
      .insert([chatData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserChats(userId) {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        item:items(id, name, price),
        buyer:profiles!chats_buyer_id_fkey(id, name, email),
        seller:profiles!chats_seller_id_fkey(id, name, email),
        messages(id, content, created_at, sender_id)
      `)
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getChatById(chatId) {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        item:items(id, name, price),
        buyer:profiles!chats_buyer_id_fkey(id, name, email),
        seller:profiles!chats_seller_id_fkey(id, name, email),
        messages(
          id, 
          content, 
          created_at, 
          sender_id,
          sender:profiles!messages_sender_id_fkey(id, name)
        )
      `)
      .eq('id', chatId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Messages
  async createMessage(messageData) {
    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, name)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Admin functions
  async getPendingItems() {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        seller:profiles!items_seller_id_fkey(id, email, name, university)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getAllUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

export default supabase;