-- ==============================================================================
-- TESSRO STUDIO & ADELINE PLATFORM - POSTGRESQL SCHEMA
-- Copy and paste this directly into Supabase (SQL Editor) or Neon Console.
-- ==============================================================================

-- 1. USERS & PROFILES TABLE
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT ('usr_' || substr(md5(random()::text), 1, 16)),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'designer', 'admin')),
  avatar TEXT,
  company TEXT,
  plan TEXT DEFAULT 'Human Studio ($49.99)',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CLIENT PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY DEFAULT ('proj_' || substr(md5(random()::text), 1, 16)),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  domain TEXT NOT NULL,
  archetype TEXT NOT NULL DEFAULT 'Liquid Glass Bento',
  mode TEXT NOT NULL DEFAULT 'human_craft' CHECK (mode IN ('human_craft', 'adeline_ai')),
  status TEXT NOT NULL DEFAULT 'live' CHECK (status IN ('live', 'building', 'review')),
  preview_url TEXT NOT NULL,
  zip_export_url TEXT,
  storage_mb NUMERIC(8, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. STUDIO TICKETS TABLE (Human Studio $49.99 & AI Builder $29.99)
CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY DEFAULT ('TSR-' || floor(1000 + random() * 9000)::text),
  client_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  service_type TEXT NOT NULL DEFAULT 'human_studio' CHECK (service_type IN ('human_studio', 'adeline_builder', 'micro_logo', 'micro_video')),
  price NUMERIC(6, 2) NOT NULL DEFAULT 49.99,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'in_design', 'in_review', 'delivered')),
  priority TEXT NOT NULL DEFAULT 'standard' CHECK (priority IN ('standard', 'rush', 'critical')),
  assigned_designer_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  deadline_hours INTEGER NOT NULL DEFAULT 72,
  revision_round INTEGER NOT NULL DEFAULT 1,
  max_revisions TEXT NOT NULL DEFAULT 'Unlimited',
  archetype TEXT NOT NULL DEFAULT 'Liquid Glass Bento',
  brief TEXT NOT NULL,
  figma_url TEXT,
  preview_url TEXT,
  zip_download_url TEXT,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TICKET MESSAGES TABLE (Real-Time 1-on-1 Communication)
CREATE TABLE IF NOT EXISTS ticket_messages (
  id TEXT PRIMARY KEY DEFAULT ('msg_' || substr(md5(random()::text), 1, 16)),
  ticket_id TEXT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  sender_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL DEFAULT 'client' CHECK (sender_role IN ('client', 'designer', 'admin')),
  avatar TEXT,
  text TEXT NOT NULL,
  attachment_url TEXT,
  attachment_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ENABLE ROW LEVEL SECURITY (RLS) FOR SUPABASE
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

-- Allow public read/write during initial setup or authenticated access
CREATE POLICY "Allow public read access to users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read/write to tickets" ON tickets FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write to ticket_messages" ON ticket_messages FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write to projects" ON projects FOR ALL USING (true);

-- Seed Initial Admin, Designer, and Client Profiles
INSERT INTO users (id, email, name, role, avatar, company, plan)
VALUES 
  ('usr_admin_01', 'elena@tessro.com', 'Elena Rostova', 'admin', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'Tessro Studio HQ', 'Owner / Studio Lead'),
  ('usr_designer_01', 'marcus.thorne@tessro.com', 'Marcus Thorne', 'designer', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Tessro Senior Studio', 'Lead Interface Architect'),
  ('usr_client_01', 'alexander@vancecapital.io', 'Alexander Vance', 'client', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'Vance Autonomous Capital', 'Human Studio ($49.99)')
ON CONFLICT (email) DO NOTHING;
