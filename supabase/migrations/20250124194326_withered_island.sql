-- Make info column nullable
ALTER TABLE levels ALTER COLUMN info DROP NOT NULL;

-- Add default value for existing rows
UPDATE levels SET info = '' WHERE info IS NULL;