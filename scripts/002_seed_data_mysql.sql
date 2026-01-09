-- MySQL Seed Data
USE kriminal;

-- Insert initial services data
INSERT IGNORE INTO services (id, title, description, image_url, icon_name, order_index) VALUES
  (UUID(), 'Siber Güvenlik', 'Biz girerek oturum keşfetmekte ya güncelde yarattığa gizli yeni gerçek gözden korumasını.', '/images/whatsapp-20image-202025-12-26-20at-2017.jpeg', 'shield-check', 1),
  (UUID(), 'Adli Bilişim', 'Dur aşağısı için iz cizum veri.üzgi hosing, sisteme koordinat iza summer ıntı erzlerin, başlımımlar teridüşü geçti talori.', '/images/whatsapp-20image-202025-12-26-20at-2017.jpeg', 'search', 2),
  (UUID(), 'Veri Kurtarma', 'Sela foccilirdi an nenedirile titial izce değerda gaçağaramasal tan merirteşayera istenirse bircilebur dar ırmmanlarım.', '/images/whatsapp-20image-202025-12-26-20at-2017.jpeg', 'hard-drive', 3),
  (UUID(), 'Geçiş Kontrol ve Güvenlik Sistemleri', 'Dur siliber öysem tanımız olan danışmazda be geçinmelerimi paçedinelirman.', '/images/whatsapp-20image-202025-12-26-20at-2017.jpeg', 'lock', 4);

-- Insert initial features data
INSERT IGNORE INTO features (id, title, description, icon_name, order_index) VALUES
  (UUID(), 'Uzman Ekip', 'Profesyonel ve deneyimli ekibimizle hizmetinizdeyiz', 'users', 1),
  (UUID(), 'Bilirkişi Raporları', 'Hukuki süreçler için detaylı bilirkişi raporları hazırlıyoruz', 'file-text', 2),
  (UUID(), 'Gelişmiş Teknoloji', 'En güncel teknolojiler ile çözümler sunuyoruz', 'cpu', 3),
  (UUID(), '7/24 Destek', 'Her zaman yanınızdayız, kesintisiz destek sağlıyoruz', 'headphones', 4);

