/*
  # Enable path editing
  
  1. Changes
    - Update paths table policies to allow full access
    - Grant necessary permissions
*/

-- Drop existing policies if any
DROP POLICY IF EXISTS "Paths are viewable by everyone" ON paths;
DROP POLICY IF EXISTS "Paths can be modified by anyone" ON paths;

-- Create a single policy that allows everything for paths
CREATE POLICY "Allow all operations"
ON paths FOR ALL
USING (true)
WITH CHECK (true);

-- Grant full permissions to anonymous users for paths
GRANT ALL ON paths TO anon;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_paths_section_id ON paths(section_id);
CREATE INDEX IF NOT EXISTS idx_paths_created_at ON paths(created_at);