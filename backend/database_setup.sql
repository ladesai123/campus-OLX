-- CampusOLX Database Setup Script
-- Run this in your Supabase SQL Editor

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  university TEXT,
  verified BOOLEAN DEFAULT FALSE,
  admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'sold')),
  images JSONB DEFAULT '[]',
  ai_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('item-images', 'item-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create basic policies for development
-- Users can read all profiles (for public info)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Anyone can view approved items
DROP POLICY IF EXISTS "Approved items are viewable by everyone" ON items;
CREATE POLICY "Approved items are viewable by everyone" ON items FOR SELECT USING (status = 'approved' OR auth.uid() = seller_id);

-- Users can insert their own items
DROP POLICY IF EXISTS "Users can insert own items" ON items;
CREATE POLICY "Users can insert own items" ON items FOR INSERT WITH CHECK (auth.uid() = seller_id);

-- Users can update their own items
DROP POLICY IF EXISTS "Users can update own items" ON items;
CREATE POLICY "Users can update own items" ON items FOR UPDATE USING (auth.uid() = seller_id);

-- Users can delete their own items
DROP POLICY IF EXISTS "Users can delete own items" ON items;
CREATE POLICY "Users can delete own items" ON items FOR DELETE USING (auth.uid() = seller_id);

-- Chat policies
DROP POLICY IF EXISTS "Users can view their own chats" ON chats;
CREATE POLICY "Users can view their own chats" ON chats FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

DROP POLICY IF EXISTS "Users can create chats" ON chats;
CREATE POLICY "Users can create chats" ON chats FOR INSERT WITH CHECK (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Message policies
DROP POLICY IF EXISTS "Users can view messages in their chats" ON messages;
CREATE POLICY "Users can view messages in their chats" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM chats WHERE chats.id = chat_id AND (chats.buyer_id = auth.uid() OR chats.seller_id = auth.uid())
  )
);

DROP POLICY IF EXISTS "Users can send messages in their chats" ON messages;
CREATE POLICY "Users can send messages in their chats" ON messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM chats WHERE chats.id = chat_id AND (chats.buyer_id = auth.uid() OR chats.seller_id = auth.uid())
  )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_seller_id ON items(seller_id);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at);
CREATE INDEX IF NOT EXISTS idx_chats_buyer_id ON chats(buyer_id);
CREATE INDEX IF NOT EXISTS idx_chats_seller_id ON chats(seller_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);

-- Insert some demo data
INSERT INTO profiles (id, email, name, university, verified, admin) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@campusolx.com', 'Admin User', 'CampusOLX University', true, true),
  ('00000000-0000-0000-0000-000000000002', 'alice@university.edu', 'Alice Johnson', 'State University', true, false),
  ('00000000-0000-0000-0000-000000000003', 'bob@college.edu', 'Bob Smith', 'Community College', true, false)
ON CONFLICT (email) DO NOTHING;

-- Insert some demo items
INSERT INTO items (id, name, description, price, category, seller_id, status, images) VALUES 
  ('00000000-0000-0000-0000-000000000101', 'Used "Intro to CS" Textbook', 'Great condition, minor highlighting', 45.00, 'Books', '00000000-0000-0000-0000-000000000002', 'approved', '["https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=2070&auto=format&fit=crop"]'),
  ('00000000-0000-0000-0000-000000000102', 'Desk Lamp', 'Barely used, excellent lighting', 15.00, 'Furniture', '00000000-0000-0000-0000-000000000003', 'approved', '["https://images.unsplash.com/photo-1543469582-01e1d493a18a?q=80&w=1974&auto=format&fit=crop"]'),
  ('00000000-0000-0000-0000-000000000103', 'Scientific Calculator', 'TI-84 Plus, perfect for math classes', 25.00, 'Electronics', '00000000-0000-0000-0000-000000000002', 'approved', '["https://images.unsplash.com/photo-1596496050827-4208a63f0329?q=80&w=2070&auto=format&fit=crop"]')
ON CONFLICT (id) DO NOTHING;