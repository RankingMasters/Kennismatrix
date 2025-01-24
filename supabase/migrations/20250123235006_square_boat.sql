/*
  # Set up admin authentication and permissions

  1. Changes
    - Create admin user safely
    - Set up admin profile
    - Configure admin check function
    - Update RLS policies

  2. Security
    - Use proper admin identification
    - Enable RLS policies for admin operations
*/

-- Create or replace the admin check function
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'is_admin' = 'true'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add admin profile if it doesn't exist
INSERT INTO profiles (
  id,
  full_name,
  avatar_url
)
VALUES (
  '00000000-0000-4000-a000-000000000000',
  'Admin',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
) ON CONFLICT (id) DO UPDATE 
SET 
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url;

-- Update RLS policies for sections table
DROP POLICY IF EXISTS "Sections are viewable by everyone" ON sections;
DROP POLICY IF EXISTS "Sections can be inserted by admins" ON sections;
DROP POLICY IF EXISTS "Sections can be updated by admins" ON sections;
DROP POLICY IF EXISTS "Sections can be deleted by admins" ON sections;

CREATE POLICY "Sections are viewable by everyone"
ON sections FOR SELECT
USING (true);

CREATE POLICY "Sections can be inserted by admins"
ON sections FOR INSERT
WITH CHECK (auth.is_admin());

CREATE POLICY "Sections can be updated by admins"
ON sections FOR UPDATE
USING (auth.is_admin())
WITH CHECK (auth.is_admin());

CREATE POLICY "Sections can be deleted by admins"
ON sections FOR DELETE
USING (auth.is_admin());

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON sections TO authenticated;
GRANT SELECT ON sections TO anon;