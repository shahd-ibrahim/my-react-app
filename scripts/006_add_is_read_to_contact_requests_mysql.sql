-- Add is_read column to contact_requests table
USE kriminal;

ALTER TABLE contact_requests 
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE NOT NULL AFTER status;

-- Add index for better performance when filtering unread messages
CREATE INDEX IF NOT EXISTS idx_is_read ON contact_requests(is_read);

-- Update existing records to be marked as read (optional - you can remove this if you want all existing messages to be unread)
-- UPDATE contact_requests SET is_read = FALSE WHERE is_read IS NULL;
