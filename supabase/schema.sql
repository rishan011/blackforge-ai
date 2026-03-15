-- BlackForge AI - Supabase Database Schema
-- Run these SQL commands in your Supabase project:
-- Dashboard -> SQL Editor -> New query -> Paste all of this -> Run

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT USING (auth.uid()::text = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE USING (auth.uid()::text = id);

-- ============================================================
-- SUMMARIES TABLE (YouTube & Web)
-- ============================================================
CREATE TABLE IF NOT EXISTS summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  youtube_url TEXT NOT NULL,
  title TEXT,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own summaries"
  ON summaries FOR ALL USING (user_id = auth.uid()::text);

-- ============================================================
-- RESUMES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'My Resume',
  resume_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own resumes"
  ON resumes FOR ALL USING (user_id = auth.uid()::text);

-- ============================================================
-- NOTES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  color TEXT DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own notes"
  ON notes FOR ALL USING (user_id = auth.uid()::text);

-- ============================================================
-- SAVED JOBS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  url TEXT,
  status TEXT DEFAULT 'saved',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own jobs"
  ON saved_jobs FOR ALL USING (user_id = auth.uid()::text);
