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

-- Update the trigger function to include more user information
CREATE OR REPLACE FUNCTION log_user_progress_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Get level and path information
    WITH level_info AS (
      SELECT 
        l.title as level_title,
        p.title as path_title
      FROM levels l
      LEFT JOIN paths p ON p.id = l.path_id
      WHERE l.id = NEW.level_id
    ),
    user_info AS (
      SELECT full_name
      FROM profiles
      WHERE id = NEW.user_id
    )
    INSERT INTO activity_log (
      user_id,
      profile_id,
      action_type,
      description
    )
    SELECT
      NEW.user_id,
      NEW.user_id,
      'completion',
      user_info.full_name || ' completed ' || level_title || ' in ' || path_title
    FROM level_info, user_info;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS user_progress_changes_trigger ON user_progress;
CREATE TRIGGER user_progress_changes_trigger
  AFTER INSERT
  ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION log_user_progress_changes();

-- Update existing activity log entries with profile information
UPDATE activity_log a
SET profile_id = a.user_id
WHERE profile_id IS NULL;