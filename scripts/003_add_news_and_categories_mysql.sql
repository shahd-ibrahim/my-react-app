-- MySQL News and Categories Tables
USE kriminal;

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  category VARCHAR(255),
  is_featured BOOLEAN DEFAULT FALSE,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_is_featured (is_featured),
  INDEX idx_published_at (published_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon_name VARCHAR(255),
  order_index INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_order_index (order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample news
INSERT IGNORE INTO news (id, title, content, category, is_featured, image_url) VALUES
  (UUID(), 'Yeni Siber Güvenlik Tehditleri 2025', 'Dijital dünyadaki gelişen tehditler ve korunma yöntemleri hakkında detaylı bilgiler...', 'Siber Güvenlik', TRUE, '/images/hero.jpeg'),
  (UUID(), 'Adli Bilişim Sektöründe Yenilikler', 'Adli bilişim teknolojilerindeki son gelişmeler ve uygulamalar...', 'Adli Bilişim', TRUE, '/images/adli-bilisim.jpg'),
  (UUID(), 'Veri Koruma Yasası Güncellemeleri', 'KVKK ve uluslararası veri koruma standartlarındaki değişiklikler...', 'Hukuk', FALSE, '/images/siber-guvenlik-1.jpg');

-- Insert sample categories
INSERT IGNORE INTO categories (id, name, description, icon_name, order_index) VALUES
  (UUID(), 'Siber Güvenlik', 'Siber güvenlik çözümleri ve tehdit analizi', 'shield', 1),
  (UUID(), 'Adli Bilişim', 'Dijital delil toplama ve analiz hizmetleri', 'search', 2),
  (UUID(), 'Veri Kurtarma', 'Kayıp verilerin kurtarılması hizmetleri', 'hard-drive', 3),
  (UUID(), 'Eğitim & Danışmanlık', 'Kurumsal eğitim ve danışmanlık hizmetleri', 'book-open', 4),
  (UUID(), 'Güvenlik Denetimi', 'Sistem ve ağ güvenlik denetimleri', 'shield-check', 5),
  (UUID(), 'Hukuki Destek', 'Siber suçlar için hukuki destek', 'scale', 6);

