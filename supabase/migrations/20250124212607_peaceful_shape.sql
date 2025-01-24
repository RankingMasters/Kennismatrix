-- Create a view for activity log with profiles
CREATE OR REPLACE VIEW activity_log_with_profiles AS
SELECT 
  a.*,
  p.full_name,
  p.avatar_url
FROM activity_log a
LEFT JOIN profiles p ON p.id = a.profile_id;

-- Grant access to the view
GRANT SELECT ON activity_log_with_profiles TO anon, authenticated;

-- Update the hooks query to use the new view
CREATE OR REPLACE FUNCTION get_recent_activity()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  profile_id uuid,
  action_type text,
  description text,
  created_at timestamptz,
  full_name text,
  avatar_url text
) AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM activity_log_with_profiles
  ORDER BY created_at DESC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql;