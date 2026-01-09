// Admin kullanıcı oluşturma scripti
// Kullanım: npx tsx scripts/create-admin.ts

import { hashPassword } from "../lib/auth"
import { execute, queryOne } from "../lib/mysql/client"

async function createAdmin() {
  const rawEmail = process.argv[2] || "admin@gaziantepkriminalburo.com"
  const password = process.argv[3] || "admin123"
  const fullName = process.argv[4] || "Admin User"

  // Email'i normalize et
  const email = rawEmail.trim().toLowerCase()

  console.log("Admin kullanıcı oluşturuluyor...")
  console.log("E-posta:", email)
  console.log("Şifre:", password)
  console.log("Ad:", fullName)

  try {
    // Kullanıcı zaten var mı kontrol et (case-insensitive)
    const existing = await queryOne("SELECT id FROM admin_users WHERE LOWER(TRIM(email)) = ?", [email])
    if (existing) {
      console.log("Bu e-posta ile bir kullanıcı zaten mevcut!")
      return
    }

    // Şifreyi hash'le
    const passwordHash = await hashPassword(password)

    // Kullanıcıyı oluştur
    await execute(
      "INSERT INTO admin_users (id, email, password_hash, full_name) VALUES (UUID(), ?, ?, ?)",
      [email, passwordHash, fullName]
    )

    console.log("✅ Admin kullanıcı başarıyla oluşturuldu!")
    console.log("\n⚠️  İLK GİRİŞTEN SONRA ŞİFREYİ MUTLAKA DEĞİŞTİRİN!")
  } catch (error: any) {
    console.error("❌ Hata:", error.message)
    process.exit(1)
  }
}

createAdmin()

