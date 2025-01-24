/*
  # Simplify admin access
  
  1. Changes
    - Remove all auth requirements
    - Make all tables fully editable
    - Keep existing data
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Sections are viewable by everyone" ON sections;
DROP POLICY IF EXISTS "Sections can be inserted by admins" ON sections;
DROP POLICY IF EXISTS "Sections can be updated by admins" ON sections;
DROP POLICY IF EXISTS "Sections can be deleted by admins" ON sections;
DROP POLICY IF EXISTS "Sections can be modified by anyone" ON sections;

-- Create a single policy that allows everything
CREATE POLICY "Allow all operations"
ON sections FOR ALL
USING (true)
WITH CHECK (true);

-- Grant full permissions to anonymous users
GRANT ALL ON sections TO anon;
GRANT ALL ON paths TO anon;
GRANT ALL ON levels TO anon;
GRANT ALL ON profiles TO anon;
GRANT ALL ON user_progress TO anon;
GRANT ALL ON activity_log TO anon;

-- Drop the is_admin function as it's no longer needed
DROP FUNCTION IF EXISTS auth.is_admin();