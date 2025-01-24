/*
  # Add activity log trigger for user progress

  1. Changes
    - Add trigger function for user progress changes
    - Create trigger on user_progress table
    - Add profile editing functionality

  2. Security
    - Maintain existing RLS policies
    - Ensure proper activity logging
*/

-- Create trigger function for user progress changes
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

-- Create trigger
DROP TRIGGER IF EXISTS user_progress_changes_trigger ON user_progress;
CREATE TRIGGER user_progress_changes_trigger
  AFTER INSERT OR DELETE
  ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION log_user_progress_changes();

-- Add profile update function
CREATE OR REPLACE FUNCTION update_profile(
  user_id uuid,
  new_full_name text,
  new_avatar_url text,
  new_email text
)
RETURNS profiles AS $$
DECLARE
  updated_profile profiles;
BEGIN
  UPDATE profiles
  SET 
    full_name = COALESCE(new_full_name, full_name),
    avatar_url = COALESCE(new_avatar_url, avatar_url),
    email = COALESCE(new_email, email)
  WHERE id = user_id
  RETURNING * INTO updated_profile;
  
  -- Log the profile update
  INSERT INTO activity_log (
    user_id,
    profile_id,
    action_type,
    description
  ) VALUES (
    user_id,
    user_id,
    'profile_update',
    'updated their profile'
  );
  
  RETURN updated_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;