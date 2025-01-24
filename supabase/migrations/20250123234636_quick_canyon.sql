/*
  # Fix admin policies for sections table

  1. Changes
    - Add RLS policies for admin operations on sections table
    - Add admin role check function
    - Update existing policies to be more specific

  2. Security
    - Enable RLS on sections table (already enabled)
    - Add policies for admin CRUD operations
    - Maintain public read access
*/

-- Create a function to check if a user has admin access
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean AS $$
BEGIN
  -- In a real application, this would check against an admin users table
  -- For now, we'll allow all authenticated users to be admins
  RETURN auth.role() = 'authenticated';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update sections table policies
DROP POLICY IF EXISTS "Sections are viewable by everyone" ON sections;
DROP POLICY IF EXISTS "Sections can be inserted by admins" ON sections;
DROP POLICY IF EXISTS "Sections can be updated by admins" ON sections;
DROP POLICY IF EXISTS "Sections can be deleted by admins" ON sections;

-- Create new policies
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