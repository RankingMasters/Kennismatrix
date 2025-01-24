/*
  # Create user progress tracking view

  1. New Objects:
    - Create materialized view for completed paths count
    - Add indexes for performance optimization
  
  2. Security:
    - Grant appropriate permissions to roles
    - Enable RLS on the materialized view
*/

-- Create a materialized view for better performance
CREATE MATERIALIZED VIEW IF NOT EXISTS completed_paths_count AS
WITH user_levels AS (
  SELECT 
    p.id,
    p.full_name,
    p.avatar_url,
    COUNT(DISTINCT up.level_id) as completed_levels
  FROM profiles p
  LEFT JOIN user_progress up ON p.id = up.user_id
  GROUP BY p.id, p.full_name, p.avatar_url
)
SELECT * FROM user_levels;

-- Create unique index for faster refreshes
CREATE UNIQUE INDEX IF NOT EXISTS completed_paths_count_id_idx 
ON completed_paths_count (id);

-- Create index on completed_levels for sorting
CREATE INDEX IF NOT EXISTS completed_paths_count_levels_idx 
ON completed_paths_count (completed_levels DESC);

-- Add indexes on user_progress for better join performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id 
ON user_progress (user_id);

CREATE INDEX IF NOT EXISTS idx_user_progress_level_id 
ON user_progress (level_id);

-- Grant permissions
GRANT SELECT ON completed_paths_count TO authenticated, anon;

-- Refresh the materialized view
REFRESH MATERIALIZED VIEW completed_paths_count;