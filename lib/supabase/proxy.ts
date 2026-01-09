import { NextResponse, type NextRequest } from "next/server"

const SESSION_COOKIE_NAME = "admin_session"

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request,
  })

  // Basic protection for admin routes - just check if session cookie exists
  // Detailed checks (session validity, admin status) are done in page components
  // This avoids MySQL connection issues in middleware/edge runtime
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value

    if (!sessionToken) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }
  }

  return response
}
