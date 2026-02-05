-- ============================================
-- Supabase Database Setup Script
-- ============================================
-- Run this SQL in Supabase SQL Editor
-- Dashboard → SQL Editor → New Query
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON profiles FOR
SELECT USING (auth.uid () = id);

CREATE POLICY "Users can insert own profile" ON profiles FOR
INSERT
WITH
    CHECK (auth.uid () = id);

CREATE POLICY "Users can update own profile" ON profiles FOR
UPDATE USING (auth.uid () = id);

-- ============================================
-- 2. GAMES TABLE
-- ============================================
CREATE TABLE games (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  platform TEXT NOT NULL,
  status TEXT NOT NULL,
  completion_percentage INTEGER DEFAULT 0,
  cover_url TEXT,
  sessions JSONB DEFAULT '[]'::JSONB,
  last_played TIMESTAMPTZ,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own games" ON games FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can insert own games" ON games FOR
INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Users can update own games" ON games FOR
UPDATE USING (auth.uid () = user_id);

CREATE POLICY "Users can delete own games" ON games FOR DELETE USING (auth.uid () = user_id);

-- Index for performance
CREATE INDEX games_user_id_idx ON games (user_id);

-- ============================================
-- 3. IDEAS TABLE
-- ============================================
CREATE TABLE ideas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own ideas" ON ideas FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can insert own ideas" ON ideas FOR
INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Users can update own ideas" ON ideas FOR
UPDATE USING (auth.uid () = user_id);

CREATE POLICY "Users can delete own ideas" ON ideas FOR DELETE USING (auth.uid () = user_id);

-- Index for performance
CREATE INDEX ideas_user_id_idx ON ideas (user_id);

-- ============================================
-- 4. APPS TABLE
-- ============================================
CREATE TABLE apps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  url TEXT,
  tech_stack TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT DEFAULT 'Development',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own apps" ON apps FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can insert own apps" ON apps FOR
INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Users can update own apps" ON apps FOR
UPDATE USING (auth.uid () = user_id);

CREATE POLICY "Users can delete own apps" ON apps FOR DELETE USING (auth.uid () = user_id);

-- Index for performance
CREATE INDEX apps_user_id_idx ON apps (user_id);

-- ============================================
-- 5. LEARNING_ITEMS TABLE
-- ============================================
CREATE TABLE learning_items (
    id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    topic TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT DEFAULT 'Learning',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE learning_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own learning" ON learning_items FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can insert own learning" ON learning_items FOR
INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Users can update own learning" ON learning_items FOR
UPDATE USING (auth.uid () = user_id);

CREATE POLICY "Users can delete own learning" ON learning_items FOR DELETE USING (auth.uid () = user_id);

-- Index for performance
CREATE INDEX learning_items_user_id_idx ON learning_items (user_id);

-- ============================================
-- 6. TRIGGER: Auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- DONE!
-- ============================================
-- Next steps:
-- 1. Verify all tables are created
-- 2. Check RLS is enabled on all tables
-- 3. Test with your app
-- ============================================