# Giriş Bilgileri

## Varsayılan Admin Kullanıcı Bilgileri

Eğer admin kullanıcısı henüz oluşturulmadıysa, aşağıdaki komutla oluşturabilirsiniz:

```bash
npx tsx scripts/create-admin.ts
```

Bu komut varsayılan olarak şu bilgilerle admin kullanıcısı oluşturur:

- **E-posta:** `admin@gaziantepkriminalburo.com`
- **Şifre:** `admin123`
- **Ad:** `Admin User`

## Özel Admin Kullanıcı Oluşturma

Farklı bilgilerle admin kullanıcısı oluşturmak için:

```bash
npx tsx scripts/create-admin.ts email@example.com sifreniz123 "Kullanıcı Adı"
```

Örnek:
```bash
npx tsx scripts/create-admin.ts admin@example.com MySecurePassword123 "Admin Kullanıcı"
```

## Giriş Sayfası

Admin paneline giriş yapmak için:

1. Tarayıcınızda şu adrese gidin: `http://localhost:3000/auth/login`
2. E-posta ve şifrenizi girin
3. "Giriş Yap" butonuna tıklayın

## Önemli Notlar

⚠️ **GÜVENLİK UYARISI:**
- İlk girişten sonra mutlaka şifrenizi değiştirin!
- Varsayılan şifreleri production ortamında kullanmayın!
- Güçlü şifreler kullanın (en az 8 karakter, büyük/küçük harf, rakam ve özel karakter içermeli)

## Sorun Giderme

### "Geçersiz e-posta veya şifre" Hatası

1. E-posta adresinin doğru yazıldığından emin olun (büyük/küçük harf fark etmez)
2. Şifrenin doğru olduğundan emin olun
3. Admin kullanıcısının oluşturulduğundan emin olun:
   ```bash
   npx tsx scripts/check-setup.ts
   ```

### Veritabanı Bağlantı Hatası

1. XAMPP Control Panel'den MySQL servisinin çalıştığından emin olun
2. `.env.local` dosyasındaki veritabanı ayarlarını kontrol edin
3. Port numarasının doğru olduğundan emin olun (varsayılan: 3307)

### Admin Kullanıcı Bulunamadı

Admin kullanıcısı oluşturmak için:
```bash
npx tsx scripts/create-admin.ts
```

Veya phpMyAdmin'de kontrol edin:
```sql
SELECT email, full_name FROM admin_users;
```
