/*
  # Fix user progress RLS policies

  1. Changes
    - Update RLS policies for user_progress table
    - Add proper policies for all operations
    - Fix permission issues

  2. Security
    - Enable RLS on user_progress table
    - Allow viewing all progress
    - Allow inserting/deleting progress by anyone (for admin functionality)
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;

-- Create new policies that allow all operations
CREATE POLICY "Allow viewing progress"
ON user_progress FOR SELECT
USING (true);

CREATE POLICY "Allow managing progress"
ON user_progress FOR ALL
USING (true)
WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON user_progress TO anon, authenticated;