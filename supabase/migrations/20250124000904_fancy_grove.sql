/*
  # Add order column to sections table

  1. Changes
    - Add `order` column to sections table
    - Set default order based on existing rows
    - Add index for better performance when ordering
*/

-- Add order column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sections' AND column_name = 'order'
  ) THEN
    -- Add the column
    ALTER TABLE sections ADD COLUMN "order" integer;
    
    -- Update existing rows with sequential order
    WITH numbered_sections AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) - 1 as row_num
      FROM sections
    )
    UPDATE sections s
    SET "order" = ns.row_num
    FROM numbered_sections ns
    WHERE s.id = ns.id;
    
    -- Make order required for future inserts
    ALTER TABLE sections ALTER COLUMN "order" SET NOT NULL;
    
    -- Add index for better performance
    CREATE INDEX idx_sections_order ON sections ("order");
  END IF;
END $$;