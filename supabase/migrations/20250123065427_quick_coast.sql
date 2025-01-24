/*
  # Fix database relationships

  1. Changes
    - Add foreign key relationships between tables
    - Update queries to use proper joins
    - Add missing indexes for performance

  2. Security
    - Maintain existing RLS policies
*/

-- Add foreign key relationship between activity_log and profiles
ALTER TABLE activity_log
ADD COLUMN profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE;

-- Update existing activity_log entries to use profile_id
UPDATE activity_log
SET profile_id = user_id;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_activity_log_profile_id ON activity_log(profile_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);

-- Update the activity_log query to use profile_id
CREATE OR REPLACE VIEW activity_log_with_users AS
SELECT 
  a.*,
  p.full_name,
  p.avatar_url
FROM activity_log a
JOIN profiles p ON p.id = a.profile_id;

-- Grant access to the view
GRANT SELECT ON activity_log_with_users TO authenticated, anon;

-- Create a view for user progress with counts
CREATE OR REPLACE VIEW user_progress_counts AS
SELECT 
  p.id,
  p.full_name,
  p.avatar_url,
  COUNT(up.id) as completed_levels
FROM profiles p
LEFT JOIN user_progress up ON up.user_id = p.id
GROUP BY p.id, p.full_name, p.avatar_url;

-- Grant access to the view
GRANT SELECT ON user_progress_counts TO authenticated, anon;