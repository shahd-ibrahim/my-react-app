-- Add image_url column to categories table
USE kriminal;

ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS image_url TEXT AFTER icon_name;
