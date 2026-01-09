import { NextRequest, NextResponse } from "next/server"
import { signIn, SESSION_COOKIE_NAME } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "E-posta ve şifre gereklidir" }, { status: 400 })
    }

    // Email'i normalize et
    const normalizedEmail = email.trim().toLowerCase()
    console.log("Login attempt for:", normalizedEmail)
    
    const result = await signIn(normalizedEmail, password)

    if (result.error) {
      console.log("Login failed:", result.error)
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    // Create response with user data
    const response = NextResponse.json({ user: result.user })

    // Set cookie in the response
    if (result.sessionToken && result.expiresAt) {
      response.cookies.set(SESSION_COOKIE_NAME, result.sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: result.expiresAt,
        path: "/",
      })
    }

    console.log("Login successful for:", email)
    return response
  } catch (error: any) {
    console.error("Login error:", error)
    console.error("Error stack:", error.stack)
    
    // MySQL bağlantı hatası kontrolü
    if (error.code === "ECONNREFUSED" || error.message?.includes("ECONNREFUSED")) {
      return NextResponse.json({ 
        error: "Veritabanı bağlantısı başarısız. Lütfen MySQL servisinin çalıştığından emin olun (XAMPP Control Panel'den MySQL'i başlatın).",
        code: "DB_CONNECTION_ERROR"
      }, { status: 500 })
    }
    
    // Diğer veritabanı hataları
    if (error.code === "ER_NO_SUCH_TABLE" || error.message?.includes("doesn't exist")) {
      return NextResponse.json({ 
        error: "Veritabanı tabloları bulunamadı. Lütfen SQL scriptlerini çalıştırdığınızdan emin olun.",
        code: "DB_TABLE_ERROR"
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      error: error.message || "Bir hata oluştu",
      code: error.code || "UNKNOWN_ERROR",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined
    }, { status: 500 })
  }
}

