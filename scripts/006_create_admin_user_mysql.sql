-- MySQL Admin User Creation Script
-- This script creates a default admin user
-- Default password: admin123 (change this after first login!)
USE kriminal;

-- Create admin user (password: admin123)
-- You should change this password after first login!
INSERT INTO admin_users (id, email, password_hash, full_name) 
VALUES (
  UUID(),
  'admin@gaziantepkriminalburo.com',
  '$2a$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', -- This is a placeholder, use bcrypt to hash 'admin123'
  'Admin User'
) ON DUPLICATE KEY UPDATE email = email;

-- Note: The password hash above is a placeholder.
-- You need to generate a proper bcrypt hash for 'admin123' using:
-- const bcrypt = require('bcryptjs');
-- const hash = await bcrypt.hash('admin123', 10);
-- Then replace the password_hash value above with the generated hash.

