-- Add detail fields to services table
USE kriminal;

ALTER TABLE services 
ADD COLUMN IF NOT EXISTS detail_content TEXT AFTER description,
ADD COLUMN IF NOT EXISTS detail_image_url TEXT AFTER image_url;
