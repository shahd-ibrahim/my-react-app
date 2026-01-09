// Admin kullanıcı kontrolü ve test scripti
// Kullanım: npx tsx scripts/check-admin.ts [email] [password]

import { query, queryOne } from "../lib/mysql/client"
import bcrypt from "bcryptjs"

async function checkAdmin() {
  const email = process.argv[2] || "admin@gaziantepkriminalburo.com"
  const password = process.argv[3] || "admin123"

  console.log("🔍 Admin kullanıcı kontrolü başlatılıyor...\n")

  try {
    // 1. Tüm admin kullanıcılarını listele
    console.log("1️⃣  Veritabanındaki tüm admin kullanıcıları:")
    const allAdmins = await query("SELECT id, email, full_name, created_at FROM admin_users")
    
    if (allAdmins.length === 0) {
      console.log("   ❌ Hiç admin kullanıcı bulunamadı!")
      console.log("\n   💡 Çözüm: Admin kullanıcı oluşturun:")
      console.log("      npx tsx scripts/create-admin.ts\n")
      process.exit(1)
    }

    allAdmins.forEach((admin: any, index: number) => {
      console.log(`   ${index + 1}. Email: ${admin.email}`)
      console.log(`      ID: ${admin.id}`)
      console.log(`      Ad: ${admin.full_name || "Belirtilmemiş"}`)
      console.log(`      Oluşturulma: ${admin.created_at}`)
      console.log("")
    })

    // 2. Normalize edilmiş email ile arama
    const normalizedEmail = email.trim().toLowerCase()
    console.log(`2️⃣  Email araması: "${normalizedEmail}"`)
    
    const admin = await queryOne<{
      id: string
      email: string
      password_hash: string
      full_name: string | null
    }>("SELECT * FROM admin_users WHERE LOWER(TRIM(email)) = ?", [normalizedEmail])

    if (!admin) {
      console.log("   ❌ Bu email ile admin kullanıcı bulunamadı!")
      console.log("\n   💡 Çözüm: Admin kullanıcı oluşturun:")
      console.log(`      npx tsx scripts/create-admin.ts ${email} ${password}\n`)
      process.exit(1)
    }

    console.log("   ✅ Admin kullanıcı bulundu!")
    console.log(`      ID: ${admin.id}`)
    console.log(`      Email: ${admin.email}`)
    console.log(`      Ad: ${admin.full_name || "Belirtilmemiş"}`)
    console.log(`      Password hash: ${admin.password_hash.substring(0, 20)}...`)

    // 3. Şifre kontrolü
    console.log(`\n3️⃣  Şifre kontrolü: "${password}"`)
    const isValid = await bcrypt.compare(password, admin.password_hash)
    
    if (isValid) {
      console.log("   ✅ Şifre doğru!")
      console.log("\n✅ Giriş bilgileri geçerli! Admin paneline giriş yapabilirsiniz.")
    } else {
      console.log("   ❌ Şifre yanlış!")
      console.log("\n   💡 Çözüm: Şifreyi güncelleyin veya yeni admin kullanıcı oluşturun:")
      console.log(`      npx tsx scripts/create-admin.ts ${email} yeni_sifre\n`)
      process.exit(1)
    }

  } catch (error: any) {
    console.error("❌ Hata:", error.message)
    console.error("   Error code:", error.code)
    if (error.code === "ECONNREFUSED") {
      console.error("\n   💡 MySQL servisinin çalıştığından emin olun!")
    }
    process.exit(1)
  }
}

checkAdmin()
