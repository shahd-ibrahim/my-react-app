-- MySQL Section Texts
-- This script creates settings for all section texts on homepage
USE kriminal;

-- Services Section Texts
INSERT IGNORE INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('services_badge', 'Hizmetlerimiz', 'text', 'Services section badge text'),
('services_title_part1', 'Uzmanlık', 'text', 'Services section title part 1'),
('services_title_part2', 'Alanlarımız', 'text', 'Services section title part 2 (gradient)'),
('services_description', 'Dijital güvenlik ve adli bilişim alanında profesyonel hizmetlerimizle yanınızdayız', 'text', 'Services section description'),
('services_button_text', 'Detaylı İncele', 'text', 'Services section button text');

-- Categories Section Texts
INSERT IGNORE INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('categories_badge', 'Kategoriler', 'text', 'Categories section badge text'),
('categories_title_part1', 'Ürün', 'text', 'Categories section title part 1'),
('categories_title_part2', 'Kategorilerimiz', 'text', 'Categories section title part 2 (gradient)'),
('categories_description', 'Geniş yelpazedeki profesyonel ürünlerimizle tüm ihtiyaçlarınızı karşılıyoruz', 'text', 'Categories section description'),
('categories_button_text', 'Daha Fazla', 'text', 'Categories section button text');

-- Features Section Texts
INSERT IGNORE INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('features_title', 'Neden Biz?', 'text', 'Features section title'),
('features_subtitle', 'Neden Bizi Tercih Etmelisiniz?', 'text', 'Features section subtitle'),
('features_footer_text', 'Dijital güvenliğiniz için yanınızdayız. Gaziantep''te tecrübemiz ve profesyonelliğimizle daima en iyi çözümleri sunuyoruz.', 'text', 'Features section footer text');

-- Contact Section Texts
INSERT IGNORE INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('contact_badge', 'İletişim', 'text', 'Contact section badge text'),
('contact_title_part1', 'Bizimle', 'text', 'Contact section title part 1'),
('contact_title_part2', 'İletişime Geçin', 'text', 'Contact section title part 2 (gradient)'),
('contact_description', 'Hemen bizimle iletişime geçin ve güvenlik ihtiyaçlarınızı paylaşın!', 'text', 'Contact section description'),
('contact_phone_label', 'Telefon', 'text', 'Contact phone label'),
('contact_phone', '+90 342 123 45 67', 'phone', 'Contact phone number'),
('contact_email_label', 'E-posta', 'text', 'Contact email label'),
('contact_email', 'info@gaziantepkriminalburo.com', 'email', 'Contact email address'),
('contact_address_label', 'Adres', 'text', 'Contact address label'),
('contact_address', 'Gaziantep, Türkiye', 'text', 'Contact address'),
('contact_button_text', 'Teklif Alın', 'text', 'Contact section button text'),
('contact_form_button', 'Mesaj Gönder', 'text', 'Contact form submit button text');
