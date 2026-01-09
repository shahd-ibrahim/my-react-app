// MySQL client for browser (uses API routes)
import { createClient as createMySQLClient } from "@/lib/mysql/client-browser"

export function createBrowserClient() {
  return createMySQLClient()
}

export const createClient = createBrowserClient
