import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/mysql/server"
import { queryOne, execute } from "@/lib/mysql/client"
import { hashPassword } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || !(await isAdmin(user.id))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Mevcut şifre ve yeni şifre gereklidir" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Yeni şifre en az 6 karakter olmalıdır" }, { status: 400 })
    }

    // Get current user with password hash
    const admin = await queryOne<{ password_hash: string }>("SELECT password_hash FROM admin_users WHERE id = ?", [
      user.id,
    ])

    if (!admin) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 })
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, admin.password_hash)
    if (!isValid) {
      return NextResponse.json({ error: "Mevcut şifre yanlış" }, { status: 400 })
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword)

    // Update password
    await execute("UPDATE admin_users SET password_hash = ? WHERE id = ?", [newPasswordHash, user.id])

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error updating password:", error)
    return NextResponse.json({ error: error.message || "Şifre güncellenemedi" }, { status: 500 })
  }
}
