-- Drop existing view if it exists
DROP VIEW IF EXISTS user_progress_view;

-- Create a new view that properly aggregates user progress
CREATE OR REPLACE VIEW user_progress_view AS
SELECT 
  p.id,
  p.full_name,
  p.avatar_url,
  COALESCE(COUNT(DISTINCT up.level_id), 0)::integer as completed_levels
FROM profiles p
LEFT JOIN user_progress up ON p.id = up.user_id
GROUP BY p.id, p.full_name, p.avatar_url;

-- Grant access to the view
GRANT SELECT ON user_progress_view TO anon, authenticated;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_level_id ON user_progress(level_id);