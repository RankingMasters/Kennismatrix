/*
  # Add activity log table

  1. New Tables
    - `activity_log`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `action_type` (text) - e.g., 'completion', 'started', 'achievement'
      - `description` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `activity_log` table
    - Add policies for reading activity logs
*/

CREATE TABLE IF NOT EXISTS activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Activity logs are viewable by everyone"
  ON activity_log
  FOR SELECT
  USING (true);

-- Insert sample activity data based on existing user progress
INSERT INTO activity_log (user_id, action_type, description)
SELECT 
  up.user_id,
  'completion',
  'Completed ' || l.title || ' level'
FROM user_progress up
JOIN levels l ON l.id = up.level_id
ON CONFLICT DO NOTHING;