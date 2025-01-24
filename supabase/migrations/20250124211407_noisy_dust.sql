-- Remove the foreign key constraint from profiles table
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Add a new trigger to generate UUIDs for profiles
CREATE OR REPLACE FUNCTION generate_profile_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id IS NULL THEN
    NEW.id := gen_random_uuid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profile_id
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION generate_profile_id();

-- Update RLS policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Profiles can be modified by anyone" ON profiles;

CREATE POLICY "Allow all operations on profiles"
ON profiles FOR ALL
USING (true)
WITH CHECK (true);