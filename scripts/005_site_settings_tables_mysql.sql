-- MySQL Site Settings Tables
-- This script creates tables for managing all site content from admin panel
USE kriminal;

-- Create site_settings table for general site configuration
CREATE TABLE IF NOT EXISTS site_settings (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  setting_key VARCHAR(255) NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type ENUM('text', 'number', 'boolean', 'url', 'email', 'phone') DEFAULT 'text',
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  INDEX idx_setting_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create hero_sections table for hero section content
CREATE TABLE IF NOT EXISTS hero_sections (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title TEXT NOT NULL,
  title_highlight TEXT,
  description TEXT NOT NULL,
  primary_button_text VARCHAR(255),
  primary_button_link VARCHAR(500),
  secondary_button_text VARCHAR(255),
  secondary_button_link VARCHAR(500),
  background_image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  order_index INT NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  INDEX idx_active_order (is_active, order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create logos table for logo management
CREATE TABLE IF NOT EXISTS logos (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  logo_type ENUM('header', 'footer', 'favicon') NOT NULL,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  width INT,
  height INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  UNIQUE KEY unique_active_logo (logo_type, is_active),
  INDEX idx_type_active (logo_type, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create header_settings table for header configuration
CREATE TABLE IF NOT EXISTS header_settings (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  site_name VARCHAR(255) NOT NULL,
  site_tagline VARCHAR(255),
  phone_number VARCHAR(50),
  cta_button_text VARCHAR(255),
  cta_button_link VARCHAR(500),
  navigation_links JSON DEFAULT (JSON_ARRAY()),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  INDEX idx_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create footer_settings table for footer configuration
CREATE TABLE IF NOT EXISTS footer_settings (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  description TEXT,
  phone_number VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  quick_links JSON DEFAULT (JSON_ARRAY()),
  copyright_text TEXT,
  legal_links JSON DEFAULT (JSON_ARRAY()),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  INDEX idx_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default settings
INSERT INTO site_settings (id, setting_key, setting_value, setting_type, description) VALUES
  (UUID(), 'site_name', 'Gaziantep Kriminal Büro', 'text', 'Site adı'),
  (UUID(), 'site_tagline', 'Siber & Güvenlik Teknolojileri', 'text', 'Site sloganı'),
  (UUID(), 'contact_phone', '+90 342 123 45 67', 'phone', 'İletişim telefonu'),
  (UUID(), 'contact_email', 'info@gaziantepkriminalburo.com', 'email', 'İletişim e-postası'),
  (UUID(), 'contact_address', 'Gaziantep, Türkiye', 'text', 'İletişim adresi')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- Insert default hero section
INSERT INTO hero_sections (
  id,
  title,
  title_highlight,
  description,
  primary_button_text,
  primary_button_link,
  secondary_button_text,
  secondary_button_link,
  background_image_url,
  is_active,
  order_index
) VALUES (
  UUID(),
  'Dijital Delilde Uzman,',
  'Güvenlikte Güvenilir',
  'Gaziantep Siber Güvenlik ve Kriminal Büro Danışmanlık olarak; siber güvenlik, adli bilişim, veri kurtarma ve geçiş kontrol çözümlerinde profesyonel hizmetinizdeyiz.',
  'Hizmetlerimizi İnceleyin',
  '#hizmetler',
  'Bizimle İletişime Geçin',
  '#iletisim',
  '/images/hero.jpeg',
  TRUE,
  0
);

-- Insert default logos
INSERT INTO logos (id, logo_type, image_url, alt_text, width, height, is_active) VALUES
  (UUID(), 'header', '/images/logo.jpeg', 'Gaziantep Kriminal Büro', 60, 60, TRUE),
  (UUID(), 'footer', '/images/logo.jpeg', 'Gaziantep Kriminal Büro', 50, 50, TRUE);

-- Insert default header settings
INSERT INTO header_settings (
  id,
  site_name,
  site_tagline,
  phone_number,
  cta_button_text,
  cta_button_link,
  navigation_links
) VALUES (
  UUID(),
  'GAZİANTEP KRİMİNAL BÜRO',
  'Siber & Güvenlik Teknolojileri',
  '+90 342 123 45 67',
  'Teklif Alın',
  '#iletisim',
  JSON_ARRAY(
    JSON_OBJECT('label', 'Anasayfa', 'href', '/'),
    JSON_OBJECT('label', 'Hizmetler', 'href', '#hizmetler'),
    JSON_OBJECT('label', 'Hakkımızda', 'href', '#hakkimizda'),
    JSON_OBJECT('label', 'İletişim', 'href', '#iletisim')
  )
);

-- Insert default footer settings
INSERT INTO footer_settings (
  id,
  description,
  phone_number,
  email,
  address,
  quick_links,
  copyright_text,
  legal_links
) VALUES (
  UUID(),
  'Dijital güvenliğiniz için yanınızdayız. Gaziantep''te tecrübemiz ile profesyonel hizmetimizeyiz.',
  '+90 342 123 45 67',
  'info@gaziantepkriminalburo.com',
  'Gaziantep, Türkiye',
  JSON_ARRAY(
    JSON_OBJECT('label', 'Hizmetler', 'href', '#hizmetler'),
    JSON_OBJECT('label', 'Hakkımızda', 'href', '#hakkimizda'),
    JSON_OBJECT('label', 'İletişim', 'href', '#iletisim')
  ),
  '© 2023 Gaziantep Kriminal Büro · Tüm Hakları Saklıdır',
  JSON_ARRAY(
    JSON_OBJECT('label', 'KVKK', 'href', '#'),
    JSON_OBJECT('label', 'Gizlilik Politikası', 'href', '#')
  )
);

