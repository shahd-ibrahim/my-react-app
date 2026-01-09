# MySQL Kurulum Rehberi

Bu proje artık MySQL veritabanı kullanmaktadır. Kurulum adımları:

## 1. MySQL Veritabanı Kurulumu

### XAMPP ile MySQL Kurulumu

1. XAMPP'ı başlatın ve MySQL servisini başlatın
2. phpMyAdmin'e gidin (http://localhost/phpmyadmin)
3. Yeni bir veritabanı oluşturun: `kriminal`

### Manuel Kurulum

```sql
CREATE DATABASE kriminal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 2. SQL Scriptlerini Çalıştırma

SQL scriptlerini sırayla çalıştırın:

1. `scripts/001_create_tables_mysql.sql` - Temel tablolar
2. `scripts/002_seed_data_mysql.sql` - Örnek veriler
3. `scripts/003_add_news_and_categories_mysql.sql` - Haberler ve kategoriler
4. `scripts/005_site_settings_tables_mysql.sql` - Site ayarları tabloları
5. `scripts/006_create_admin_user_mysql.sql` - Admin kullanıcı (şifreyi değiştirin!)

## 3. Ortam Değişkenlerini Ayarlama

`.env.local` dosyası oluşturun:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=kriminal
```

## 4. Paketleri Yükleme

```bash
npm install
# veya
pnpm install
```

## 5. Admin Kullanıcı Oluşturma

Admin kullanıcı oluşturmak için bir script çalıştırın:

```typescript
// scripts/create-admin.ts
import { hashPassword } from "@/lib/auth"
import { execute } from "@/lib/mysql/client"

async function createAdmin() {
  const email = "admin@gaziantepkriminalburo.com"
  const password = "
  " // İlk girişten sonra değiştirin!
  const passwordHash = await hashPassword(password)
  
  await execute(
    "INSERT INTO admin_users (id, email, password_hash, full_name) VALUES (UUID(), ?, ?, ?)",
    [email, passwordHash, "Admin User"]
  )
  
  console.log("Admin kullanıcı oluşturuldu!")
  console.log("E-posta:", email)
  console.log("Şifre:", password)
}

createAdmin()
```

Veya doğrudan SQL ile (bcrypt hash'i manuel oluşturmanız gerekir):

```sql
-- bcrypt hash'i oluşturmak için Node.js'te:
-- const bcrypt = require('bcryptjs');
-- const hash = await bcrypt.hash('admin123', 10);
-- Sonra aşağıdaki SQL'i çalıştırın:

INSERT INTO admin_users (id, email, password_hash, full_name) 
VALUES (UUID(), 'admin@example.com', 'BURAYA_BCRYPT_HASH', 'Admin User');
```

## 6. Uygulamayı Başlatma

```bash
npm run dev
# veya
pnpm dev
```

## Önemli Notlar

1. **Güvenlik**: İlk girişten sonra admin şifresini mutlaka değiştirin!
2. **Veritabanı Yedekleme**: Düzenli olarak veritabanını yedekleyin
3. **Ortam Değişkenleri**: Production ortamında güvenli şifreler kullanın
4. **Session Yönetimi**: Session'lar 7 gün süreyle geçerlidir

## Sorun Giderme

### Bağlantı Hatası
- MySQL servisinin çalıştığından emin olun
- Ortam değişkenlerini kontrol edin
- Firewall ayarlarını kontrol edin

### Authentication Hatası
- Admin kullanıcının oluşturulduğundan emin olun
- Şifre hash'inin doğru olduğundan emin olun

### JSON Parse Hatası
- MySQL 5.7.8+ veya MariaDB 10.2.7+ kullanıldığından emin olun
- JSON alanlarının doğru formatta olduğundan emin olun

