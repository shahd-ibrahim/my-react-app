import { cookies } from "next/headers"
import { getSession, createSession, deleteSession } from "./mysql/server"
import bcrypt from "bcryptjs"

export const SESSION_COOKIE_NAME = "admin_session"
const SESSION_DURATION_DAYS = 7

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionToken) {
    return null
  }

  const session = await getSession(sessionToken)
  if (!session) {
    return null
  }

  return {
    id: session.user_id,
    sessionToken: session.token,
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { getAdminByEmail } = await import("./mysql/server")
    
    // Email'i normalize et: trim ve lowercase
    const normalizedEmail = email.trim().toLowerCase()
    
    console.log("[AUTH] Sign in attempt - normalized email:", normalizedEmail)
    console.log("[AUTH] Password provided:", password ? "***" : "empty")
    
    if (!normalizedEmail || !password) {
      return { error: "E-posta ve şifre gereklidir" }
    }
    
    let admin
    try {
      admin = await getAdminByEmail(normalizedEmail)
      console.log("[AUTH] Admin lookup result:", admin ? "Found" : "Not found")
      if (admin) {
        console.log("[AUTH] Admin ID:", admin.id)
        console.log("[AUTH] Admin email:", admin.email)
        console.log("[AUTH] Password hash exists:", !!admin.password_hash)
      }
    } catch (dbError: any) {
      console.error("[AUTH] Database error in getAdminByEmail:", dbError)
      console.error("[AUTH] Error code:", dbError.code)
      console.error("[AUTH] Error message:", dbError.message)
      // Veritabanı hatasını yukarı fırlat
      throw dbError
    }

    if (!admin) {
      console.log("[AUTH] Admin not found for email:", normalizedEmail)
      // Tüm admin kullanıcılarını listele (debug için)
      try {
        const { query } = await import("./mysql/client")
        const allAdmins = await query("SELECT email FROM admin_users LIMIT 5")
        console.log("[AUTH] Available admin emails:", allAdmins)
      } catch (e) {
        // Ignore
      }
      return { error: "Geçersiz e-posta veya şifre" }
    }

    console.log("[AUTH] Comparing password...")
    const isValid = await bcrypt.compare(password, admin.password_hash)
    console.log("[AUTH] Password comparison result:", isValid)
    
    if (!isValid) {
      console.log("[AUTH] Password mismatch for email:", normalizedEmail)
      return { error: "Geçersiz e-posta veya şifre" }
    }
    
    console.log("[AUTH] Password verified successfully")

    // Create session
    const sessionToken = generateSessionToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS)

    try {
      await createSession(admin.id, sessionToken, expiresAt)
    } catch (sessionError: any) {
      console.error("Session creation error:", sessionError)
      throw sessionError
    }

    // Return session token so it can be set in the API route
    return { 
      user: { id: admin.id, email: admin.email, full_name: admin.full_name },
      sessionToken,
      expiresAt
    }
  } catch (error: any) {
    console.error("signIn error:", error)
    // Hataları yukarı fırlat ki API route'da yakalanabilsin
    throw error
  }
}

export async function signOut() {
  const user = await getCurrentUser()
  if (user?.sessionToken) {
    await deleteSession(user.sessionToken)
  }
  // Cookie deletion will be handled in the API route
}

function generateSessionToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    Date.now().toString(36)
  )
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

