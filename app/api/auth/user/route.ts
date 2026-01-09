import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { queryOne } from "@/lib/mysql/client"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(null)
    }

    const adminUser = await queryOne<{
      id: string
      email: string
      full_name: string | null
    }>("SELECT id, email, full_name FROM admin_users WHERE id = ?", [user.id])

    if (!adminUser) {
      return NextResponse.json(null)
    }

    return NextResponse.json(adminUser)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

