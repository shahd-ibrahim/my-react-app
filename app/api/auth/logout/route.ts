import { NextRequest, NextResponse } from "next/server"
import { signOut, SESSION_COOKIE_NAME } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await signOut()
    
    // Create response and delete cookie
    const response = NextResponse.json({ success: true })
    response.cookies.delete(SESSION_COOKIE_NAME)
    
    return response
  } catch (error: any) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

