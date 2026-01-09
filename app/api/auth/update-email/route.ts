import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/mysql/server"
import { execute, queryOne } from "@/lib/mysql/client"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || !(await isAdmin(user.id))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Geçerli bir e-posta adresi girin" }, { status: 400 })
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase()

    // Check if email is already taken
    const existing = await queryOne("SELECT id FROM admin_users WHERE LOWER(TRIM(email)) = ? AND id != ?", [
      normalizedEmail,
      user.id,
    ])

    if (existing) {
      return NextResponse.json({ error: "Bu e-posta adresi zaten kullanılıyor" }, { status: 400 })
    }

    // Update email
    await execute("UPDATE admin_users SET email = ? WHERE id = ?", [normalizedEmail, user.id])

    return NextResponse.json({ success: true, email: normalizedEmail })
  } catch (error: any) {
    console.error("Error updating email:", error)
    return NextResponse.json({ error: error.message || "E-posta güncellenemedi" }, { status: 500 })
  }
}
