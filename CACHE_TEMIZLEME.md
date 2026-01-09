# Next.js Cache Temizleme Rehberi

Chunk yükleme hatalarını çözmek için aşağıdaki adımları izleyin:

## 1. Dev Server'ı Durdurun

Terminal'de çalışan `npm run dev` veya `pnpm dev` komutunu durdurun (Ctrl+C)

## 2. Cache'i Temizleyin

### Windows PowerShell:
```powershell
# .next klasörünü sil
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# node_modules cache'i temizle (varsa)
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
```

### Windows CMD:
```cmd
rmdir /s /q .next
rmdir /s /q node_modules\.cache
```

### Mac/Linux:
```bash
rm -rf .next
rm -rf node_modules/.cache
```

## 3. Tarayıcı Cache'ini Temizleyin

1. Tarayıcıda `Ctrl+Shift+Delete` (Windows) veya `Cmd+Shift+Delete` (Mac) tuşlarına basın
2. "Cached images and files" seçeneğini işaretleyin
3. "Clear data" butonuna tıklayın

Veya:
- Chrome/Edge: `Ctrl+Shift+R` (Hard Refresh)
- Firefox: `Ctrl+F5`

## 4. Dev Server'ı Yeniden Başlatın

```bash
npm run dev
# veya
pnpm dev
```

## 5. Hala Sorun Varsa

### Node Modules'ü Yeniden Yükleyin:
```bash
# node_modules'ü sil
Remove-Item -Recurse -Force node_modules

# package-lock.json'ı sil (varsa)
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# Paketleri yeniden yükle
npm install
# veya
pnpm install
```

### Next.js'i Güncelleyin:
```bash
npm install next@latest
# veya
pnpm add next@latest
```

## Yaygın Hatalar ve Çözümleri

### "Failed to load chunk" Hatası
- Dev server'ı durdurup yeniden başlatın
- Tarayıcı cache'ini temizleyin
- `.next` klasörünü silin

### "Module not found" Hatası
- `node_modules` klasörünü silip yeniden yükleyin
- `package.json` dosyasını kontrol edin

### Port Zaten Kullanımda
```bash
# Port 3000'i kullanan process'i bul ve durdur
netstat -ano | findstr :3000
taskkill /PID <PID_NUMARASI> /F
```

