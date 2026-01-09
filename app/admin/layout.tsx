import type React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/mysql/server"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  const userIsAdmin = await isAdmin(user.id)

  if (!userIsAdmin) {
    redirect("/auth/login")
  }

  return <>{children}</>
}
