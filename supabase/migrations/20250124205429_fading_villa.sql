/*
  # Fix user management schema

  1. Changes
    - Add email column to profiles table
    - Create view for user progress with completed levels count
    - Update RLS policies for profiles table
    - Add indexes for better performance

  2. Security
    - Enable RLS on profiles table
    - Add policies for viewing and managing profiles
*/

-- Add email column to profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email text;
  END IF;
END $$;

-- Create or replace view for user progress
CREATE OR REPLACE VIEW user_progress_view AS
SELECT 
  p.id,
  p.full_name,
  p.avatar_url,
  p.email,
  COUNT(up.id) as completed_levels
FROM profiles p
LEFT JOIN user_progress up ON p.id = up.user_id
GROUP BY p.id, p.full_name, p.avatar_url, p.email;

-- Grant access to the view
GRANT SELECT ON user_progress_view TO anon, authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_level_id ON user_progress(level_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Update RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Profiles can be modified by anyone"
ON profiles FOR ALL
USING (true)
WITH CHECK (true);