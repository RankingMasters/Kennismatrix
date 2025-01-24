-- Add order column to paths table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'paths' AND column_name = 'order'
  ) THEN
    -- Add the column
    ALTER TABLE paths ADD COLUMN "order" integer;
    
    -- Update existing rows with sequential order within each section
    WITH numbered_paths AS (
      SELECT 
        id,
        section_id,
        ROW_NUMBER() OVER (PARTITION BY section_id ORDER BY created_at) - 1 as row_num
      FROM paths
    )
    UPDATE paths p
    SET "order" = np.row_num
    FROM numbered_paths np
    WHERE p.id = np.id;
    
    -- Make order required for future inserts
    ALTER TABLE paths ALTER COLUMN "order" SET NOT NULL;
    
    -- Add index for better performance
    CREATE INDEX idx_paths_order ON paths ("order");
  END IF;
END $$;