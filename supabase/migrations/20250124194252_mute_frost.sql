-- Drop existing policies if any
DROP POLICY IF EXISTS "Levels are viewable by everyone" ON levels;
DROP POLICY IF EXISTS "Allow all operations" ON levels;

-- Create policies for levels table
CREATE POLICY "Levels are viewable by everyone"
ON levels FOR SELECT
USING (true);

CREATE POLICY "Levels can be modified by anyone"
ON levels FOR ALL
USING (true)
WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON levels TO anon, authenticated;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_levels_rank ON levels(rank);
CREATE INDEX IF NOT EXISTS idx_levels_path_id ON levels(path_id);