# Hızlı Kurulum Rehberi

## 1. MySQL Servisini Başlatma

**XAMPP Control Panel'den:**
1. XAMPP Control Panel'i açın
2. MySQL'in yanındaki "Start" butonuna tıklayın
3. MySQL servisinin başladığını kontrol edin (yeşil renk)

## 2. Veritabanını Oluşturma

**phpMyAdmin'den (http://localhost/phpmyadmin):**
1. Sol menüden "New" (Yeni) butonuna tıklayın
2. Veritabanı adı: `kriminal`
3. Collation: `utf8mb4_unicode_ci`
4. "Create" (Oluştur) butonuna tıklayın

## 3. SQL Scriptlerini Çalıştırma

phpMyAdmin'de `kriminal` veritabanını seçin ve sırayla şu scriptleri çalıştırın:

1. `scripts/001_create_tables_mysql.sql` - Temel tablolar
2. `scripts/002_seed_data_mysql.sql` - Örnek veriler (varsa)
3. `scripts/003_add_news_and_categories_mysql.sql` - Haberler ve kategoriler
4. `scripts/005_site_settings_tables_mysql.sql` - Site ayarları tabloları

## 4. Admin Kullanıcı Oluşturma

Terminal'de şu komutu çalıştırın:

```bash
npx tsx scripts/create-admin.ts
```

Veya manuel olarak phpMyAdmin'de SQL çalıştırın:

```sql
-- Önce bcrypt hash oluşturun (Node.js'te):
-- const bcrypt = require('bcryptjs');
-- const hash = await bcrypt.hash('admin123', 10);
-- Sonra aşağıdaki SQL'i çalıştırın:

INSERT INTO admin_users (id, email, password_hash, full_name) 
VALUES (
  UUID(), 
  'admin@gaziantepkriminalburo.com', 
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- admin123 için hash
  'Admin User'
);
```

## 5. Ortam Değişkenlerini Kontrol Etme

`.env.local` dosyasının var olduğundan ve şu değerleri içerdiğinden emin olun:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3307
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=kriminal
```

## 6. Veritabanı Bağlantısını Test Etme

```bash
npx tsx scripts/test-db-connection.ts
```

Başarılı olursa "Database connection test successful!" mesajını göreceksiniz.

## 7. Uygulamayı Başlatma

```bash
npm run dev
```

## Sorun Giderme

### MySQL Bağlantı Hatası (ECONNREFUSED)
- XAMPP Control Panel'den MySQL servisinin çalıştığından emin olun
- Port 3306'nın başka bir uygulama tarafından kullanılmadığından emin olun

### Tablo Bulunamadı Hatası
- SQL scriptlerinin sırayla çalıştırıldığından emin olun
- phpMyAdmin'de `kriminal` veritabanını seçtiğinizden emin olun

### Admin Kullanıcı Bulunamadı
- `scripts/create-admin.ts` scriptini çalıştırdığınızdan emin olun
- phpMyAdmin'de `admin_users` tablosunda kayıt olduğunu kontrol edin

