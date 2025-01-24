/*
  # Add user progress data

  1. Changes
    - Add sample user progress data for the existing users
    - Insert progress records for completed levels
    - Fix UUID casting for user IDs
  
  2. Security
    - Uses existing RLS policies
*/

-- Get the UX/UI Designer path levels for our sample data
WITH uxui_levels AS (
  SELECT l.id, l.rank
  FROM paths p
  JOIN levels l ON l.path_id = p.id
  WHERE p.title = 'UX/UI Designer'
)
INSERT INTO user_progress (user_id, level_id)
SELECT 
  user_id::uuid,
  level_id
FROM (
  -- Sarah Johnson (completed all 4 levels)
  SELECT 
    'd0d8c19e-1b8b-4b72-8244-34740c5a8f76'::uuid as user_id,
    id as level_id
  FROM uxui_levels
  WHERE rank <= 4
  
  UNION ALL
  
  -- Michael Chen (completed 3 levels)
  SELECT 
    'c0f8d29e-2b7b-4b82-9254-45740c5a8f77'::uuid as user_id,
    id as level_id
  FROM uxui_levels
  WHERE rank <= 3
  
  UNION ALL
  
  -- Emma Davis (completed 2 levels)
  SELECT 
    'b0e8f39e-3b6b-4b92-8264-56740c5a8f78'::uuid as user_id,
    id as level_id
  FROM uxui_levels
  WHERE rank <= 2
  
  -- James Wilson (completed 1 level)
  UNION ALL
  SELECT 
    'a0d8e49e-4b5b-4ba2-9274-67740c5a8f79'::uuid as user_id,
    id as level_id
  FROM uxui_levels
  WHERE rank <= 1
) AS user_levels
ON CONFLICT (user_id, level_id) DO NOTHING;

-- Refresh the materialized view to include new progress
REFRESH MATERIALIZED VIEW completed_paths_count;