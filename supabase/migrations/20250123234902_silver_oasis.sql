/*
  # Add admin user and update auth policies

  1. Changes
    - Add admin user to auth.users
    - Add admin user to profiles
    - Update RLS policies for admin access

  2. Security
    - Create admin user with secure credentials
    - Set up proper RLS policies for admin operations
*/

-- Create admin user if not exists
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role
)
VALUES (
  '00000000-0000-4000-a000-000000000000',
  'admin@rankingmasters.com',
  crypt('R-M@sters-007', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"is_admin":true}',
  now(),
  now(),
  'authenticated'
) ON CONFLICT DO NOTHING;

-- Add admin profile
INSERT INTO profiles (
  id,
  full_name,
  avatar_url
)
VALUES (
  '00000000-0000-4000-a000-000000000000',
  'Admin',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
) ON CONFLICT DO NOTHING;

-- Update is_admin function to check for specific admin user
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    auth.uid() = '00000000-0000-4000-a000-000000000000'::uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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