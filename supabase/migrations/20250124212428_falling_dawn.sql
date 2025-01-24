-- Remove the foreign key constraint from user_progress table
ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS user_progress_user_id_fkey;

-- Update RLS policies to ensure they work without auth
DROP POLICY IF EXISTS "Allow viewing progress" ON user_progress;
DROP POLICY IF EXISTS "Allow managing progress" ON user_progress;

CREATE POLICY "Allow all operations on user_progress"
ON user_progress FOR ALL
USING (true)
WITH CHECK (true);

-- Update the activity log trigger to handle null auth.uid
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
      'completed ' || level_title || ' in ' || path_title
    FROM level_info;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS user_progress_changes_trigger ON user_progress;
CREATE TRIGGER user_progress_changes_trigger
  AFTER INSERT OR DELETE
  ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION log_user_progress_changes();