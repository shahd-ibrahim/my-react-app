-- Add detailed fields to services table for better content management
USE kriminal;

ALTER TABLE services 
ADD COLUMN IF NOT EXISTS experience_years INT DEFAULT 0 AFTER detail_content,
ADD COLUMN IF NOT EXISTS experience_description TEXT AFTER experience_years,
ADD COLUMN IF NOT EXISTS benefits TEXT AFTER experience_description,
ADD COLUMN IF NOT EXISTS features TEXT AFTER benefits,
ADD COLUMN IF NOT EXISTS gallery_images TEXT AFTER features;

-- gallery_images will store JSON array of image URLs
