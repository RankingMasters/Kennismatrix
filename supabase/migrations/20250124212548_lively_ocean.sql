-- Remove foreign key constraints from activity_log table
ALTER TABLE activity_log DROP CONSTRAINT IF EXISTS activity_log_user_id_fkey;
ALTER TABLE activity_log DROP CONSTRAINT IF EXISTS activity_log_profile_id_fkey;

-- Update RLS policies
DROP POLICY IF EXISTS "Activity logs are viewable by everyone" ON activity_log;

CREATE POLICY "Allow all operations on activity_log"
ON activity_log FOR ALL
USING (true)
WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON activity_log TO anon, authenticated;

-- Update the trigger function to handle null values
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