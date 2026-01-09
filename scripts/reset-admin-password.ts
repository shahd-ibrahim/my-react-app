// Admin kullanıcı şifresini sıfırlama scripti
// Kullanım: npx tsx scripts/reset-admin-password.ts [email] [yeni_sifre]

import { hashPassword } from "../lib/auth"
import { execute, queryOne } from "../lib/mysql/client"

async function resetAdminPassword() {
  const rawEmail = process.argv[2] || "admin@gaziantepkriminalburo.com"
  const newPassword = process.argv[3] || "admin123"

  // Email'i normalize et
  const email = rawEmail.trim().toLowerCase()

  console.log("🔄 Admin kullanıcı şifresi sıfırlanıyor...\n")
  console.log("E-posta:", email)
  console.log("Yeni şifre:", newPassword)
  console.log("")

  try {
    // Kullanıcıyı bul
    const admin = await queryOne("SELECT id, email FROM admin_users WHERE LOWER(TRIM(email)) = ?", [email])
    
    if (!admin) {
      console.log("❌ Bu email ile admin kullanıcı bulunamadı!")
      console.log("\n💡 Yeni admin kullanıcı oluşturmak için:")
      console.log(`   npx tsx scripts/create-admin.ts ${email} ${newPassword}\n`)
      process.exit(1)
    }

    console.log("✅ Admin kullanıcı bulundu!")
    console.log(`   ID: ${(admin as any).id}`)
    console.log(`   Email: ${(admin as any).email}`)
    console.log("")

    // Yeni şifreyi hash'le
    console.log("🔐 Şifre hash'leniyor...")
    const passwordHash = await hashPassword(newPassword)
    console.log("✅ Şifre hash'lendi")
    console.log("")

    // Şifreyi güncelle
    console.log("💾 Veritabanı güncelleniyor...")
    await execute(
      "UPDATE admin_users SET password_hash = ? WHERE id = ?",
      [passwordHash, (admin as any).id]
    )

    console.log("✅ Admin kullanıcı şifresi başarıyla güncellendi!")
    console.log("\n📝 Giriş bilgileri:")
    console.log(`   E-posta: ${email}`)
    console.log(`   Şifre: ${newPassword}`)
    console.log("\n⚠️  İLK GİRİŞTEN SONRA ŞİFREYİ MUTLAKA DEĞİŞTİRİN!")
  } catch (error: any) {
    console.error("❌ Hata:", error.message)
    console.error("   Error code:", error.code)
    if (error.code === "ECONNREFUSED") {
      console.error("\n   💡 MySQL servisinin çalıştığından emin olun!")
    }
    process.exit(1)
  }
}

resetAdminPassword()
