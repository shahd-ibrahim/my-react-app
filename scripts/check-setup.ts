// Kurulum kontrol scripti
// Kullanım: npx tsx scripts/check-setup.ts

import { getPool, query, queryOne } from "../lib/mysql/client"

async function checkSetup() {
  console.log("🔍 Kurulum kontrolü başlatılıyor...\n")

  // 1. Veritabanı bağlantısı kontrolü
  console.log("1️⃣  Veritabanı bağlantısı kontrol ediliyor...")
  try {
    const pool = getPool()
    await query("SELECT 1")
    console.log("   ✅ Veritabanı bağlantısı başarılı\n")
  } catch (error: any) {
    console.error("   ❌ Veritabanı bağlantısı başarısız!")
    console.error("   Hata:", error.message)
    console.error("\n   💡 Çözüm: XAMPP Control Panel'den MySQL servisini başlatın\n")
    process.exit(1)
  }

  // 2. Tabloları kontrol et
  console.log("2️⃣  Veritabanı tabloları kontrol ediliyor...")
  const requiredTables = [
    "admin_users",
    "sessions",
    "services",
    "features",
    "contact_requests"
  ]

  for (const table of requiredTables) {
    try {
      const result = await query(`SHOW TABLES LIKE '${table}'`)
      if (result.length > 0) {
        console.log(`   ✅ ${table} tablosu mevcut`)
      } else {
        console.error(`   ❌ ${table} tablosu bulunamadı!`)
        console.error(`   💡 Çözüm: scripts/001_create_tables_mysql.sql scriptini çalıştırın\n`)
        process.exit(1)
      }
    } catch (error: any) {
      console.error(`   ❌ ${table} tablosu kontrol edilemedi:`, error.message)
      process.exit(1)
    }
  }
  console.log("")

  // 3. Admin kullanıcı kontrolü
  console.log("3️⃣  Admin kullanıcı kontrol ediliyor...")
  try {
    const adminCount = await query("SELECT COUNT(*) as count FROM admin_users")
    const count = (adminCount[0] as any).count

    if (count > 0) {
      console.log(`   ✅ ${count} admin kullanıcı bulundu`)
      
      // Admin kullanıcıları listele
      const admins = await query("SELECT email, full_name FROM admin_users LIMIT 5")
      console.log("   📋 Admin kullanıcılar:")
      admins.forEach((admin: any) => {
        console.log(`      - ${admin.email} (${admin.full_name || "İsimsiz"})`)
      })
    } else {
      console.error("   ❌ Admin kullanıcı bulunamadı!")
      console.error("   💡 Çözüm: scripts/create-admin.ts scriptini çalıştırın")
      console.error("      Komut: npx tsx scripts/create-admin.ts\n")
      process.exit(1)
    }
  } catch (error: any) {
    console.error("   ❌ Admin kullanıcı kontrol edilemedi:", error.message)
    process.exit(1)
  }

  console.log("\n✅ Tüm kontroller başarılı! Giriş yapabilirsiniz.")
  console.log("\n📝 Giriş bilgileri:")
  try {
    const firstAdmin = await queryOne("SELECT email FROM admin_users LIMIT 1")
    if (firstAdmin) {
      console.log(`   E-posta: ${(firstAdmin as any).email}`)
      console.log("   Şifre: (oluştururken belirlediğiniz şifre)")
    }
  } catch (error) {
    // Ignore
  }
}

checkSetup()

