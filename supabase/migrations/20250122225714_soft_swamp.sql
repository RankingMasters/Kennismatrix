/*
  # Learning Platform Schema

  1. New Tables
    - `sections`
      - Main learning categories (Design, Development, etc.)
    - `paths`
      - Learning paths within sections
    - `levels`
      - Career levels for each path
    - `user_progress`
      - Tracks user completion of levels
    - `profiles`
      - Extended user profile information

  2. Security
    - Enable RLS on all tables
    - Add policies for reading public data
    - Add policies for user-specific data
*/

-- Sections table
CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sections are viewable by everyone" ON sections
  FOR SELECT USING (true);

-- Paths table
CREATE TABLE IF NOT EXISTS paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid REFERENCES sections(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  hours integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE paths ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Paths are viewable by everyone" ON paths
  FOR SELECT USING (true);

-- Levels table
CREATE TABLE IF NOT EXISTS levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id uuid REFERENCES paths(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  rank integer NOT NULL,
  rewards jsonb NOT NULL DEFAULT '[]',
  info text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Levels are viewable by everyone" ON levels
  FOR SELECT USING (true);

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- User Progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  level_id uuid REFERENCES levels(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, level_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all progress" ON user_progress
  FOR SELECT USING (true);
CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert initial data
INSERT INTO sections (title, description, icon, color) VALUES
  ('Design', 'UX/UI, Motion, Graphic Design, and Brand Specialization', 'Palette', 'from-purple-500 to-pink-500'),
  ('Development', 'Frontend, Backend, Mobile, and Cloud Development', 'Code', 'from-blue-500 to-cyan-500'),
  ('SEO', 'Technical SEO, Content Strategy, and Analytics', 'Search', 'from-green-500 to-emerald-500'),
  ('SEA', 'PPC Advertising and Campaign Management', 'LineChart', 'from-orange-500 to-red-500'),
  ('DGMer', 'Digital Marketing and Community Management', 'Users', 'from-indigo-500 to-purple-500')
ON CONFLICT DO NOTHING;