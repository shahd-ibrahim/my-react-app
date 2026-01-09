-- Insert initial services data
insert into public.services (title, description, image_url, icon_name, order_index) values
  ('Siber Güvenlik', 'Biz girerek oturum keşfetmekte ya güncelde yarattığa gizli yeni gerçek gözden korumasını.', '/images/whatsapp-20image-202025-12-26-20at-2017.jpeg', 'shield-check', 1),
  ('Adli Bilişim', 'Dur aşağısı için iz cizum veri.üzgi hosing, sisteme koordinat iza summer ıntı erzlerin, başlımımlar teridüşü geçti talori.', '/images/whatsapp-20image-202025-12-26-20at-2017.jpeg', 'search', 2),
  ('Veri Kurtarma', 'Sela foccilirdi an nenedirile titial izce değerda gaçağaramasal tan merirteşayera istenirse bircilebur dar ırmmanlarım.', '/images/whatsapp-20image-202025-12-26-20at-2017.jpeg', 'hard-drive', 3),
  ('Geçiş Kontrol ve Güvenlik Sistemleri', 'Dur siliber öysem tanımız olan danışmazda be geçinmelerimi paçedinelirman.', '/images/whatsapp-20image-202025-12-26-20at-2017.jpeg', 'lock', 4)
on conflict do nothing;

-- Insert initial features data
insert into public.features (title, description, icon_name, order_index) values
  ('Uzman Ekip', 'Profesyonel ve deneyimli ekibimizle hizmetinizdeyiz', 'users', 1),
  ('Bilirkişi Raporları', 'Hukuki süreçler için detaylı bilirkişi raporları hazırlıyoruz', 'file-text', 2),
  ('Gelişmiş Teknoloji', 'En güncel teknolojiler ile çözümler sunuyoruz', 'cpu', 3),
  ('7/24 Destek', 'Her zaman yanınızdayız, kesintisiz destek sağlıyoruz', 'headphones', 4)
on conflict do nothing;
