import { getPool, query, queryOne, execute } from "./client"

export { getPool, query, queryOne, execute }

// Helper function to check if user is admin
export async function isAdmin(userId: string): Promise<boolean> {
  const admin = await queryOne<{ id: string }>(
    "SELECT id FROM admin_users WHERE id = ?",
    [userId]
  )
  return !!admin
}

// Helper function to get admin user by email
export async function getAdminByEmail(email: string) {
  // Email zaten normalize edilmiş olarak geliyor, ama yine de kontrol edelim
  const normalizedEmail = email.trim().toLowerCase()
  console.log("[DB] getAdminByEmail called with:", normalizedEmail)
  
  const result = await queryOne<{
    id: string
    email: string
    password_hash: string
    full_name: string | null
  }>("SELECT * FROM admin_users WHERE LOWER(TRIM(email)) = ?", [normalizedEmail])
  
  console.log("[DB] Query result:", result ? "Found" : "Not found")
  return result
}

// Helper function to create session
export async function createSession(userId: string, token: string, expiresAt: Date) {
  await execute(
    "INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)",
    [userId, token, expiresAt]
  )
}

// Helper function to get session
export async function getSession(token: string) {
  return await queryOne<{
    id: string
    user_id: string
    token: string
    expires_at: Date
  }>(
    "SELECT * FROM sessions WHERE token = ? AND expires_at > NOW()",
    [token]
  )
}

// Helper function to delete session
export async function deleteSession(token: string) {
  await execute("DELETE FROM sessions WHERE token = ?", [token])
}

// Helper function to clean expired sessions
export async function cleanExpiredSessions() {
  await execute("DELETE FROM sessions WHERE expires_at < NOW()")
}

