// Browser-side MySQL client (uses API routes)
// This is a compatibility layer that mimics Supabase client API

export class MySQLClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  }

  from(table: string) {
    return {
      select: (columns: string = "*") => {
        const queryBuilder: any = {
          eq: (column: string, value: any) => ({
            single: async () => {
              const response = await fetch(`${this.baseUrl}/api/mysql/${table}?${column}=${encodeURIComponent(value)}`)
              if (!response.ok) return { data: null, error: { message: "Not found" } }
              const data = await response.json()
              return { data, error: null }
            },
            limit: async (limit: number) => ({
              single: async () => {
                const response = await fetch(`${this.baseUrl}/api/mysql/${table}?${column}=${encodeURIComponent(value)}&limit=${limit}`)
                if (!response.ok) return { data: null, error: { message: "Not found" } }
                const data = await response.json()
                return { data: Array.isArray(data) ? data[0] : data, error: null }
              },
            }),
          }),
          in: (column: string, values: any[]) => {
            const queryBuilder: any = {
              then: async (resolve?: (value: any) => any) => {
                try {
                  // IN clause için her değeri ayrı parametre olarak gönder (aynı key ile)
                  const params = values.map((val) => `${column}=${encodeURIComponent(val)}`).join("&")
                  const response = await fetch(`${this.baseUrl}/api/mysql/${table}?${params}`)
                  if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
                    const result = { data: null, error: { message: errorData.error || "Request failed" } }
                    return resolve ? resolve(result) : result
                  }
                  const data = await response.json()
                  const result = { data: Array.isArray(data) ? data : [data], error: null }
                  return resolve ? resolve(result) : result
                } catch (error: any) {
                  const result = { data: null, error: { message: error.message || "Network error" } }
                  return resolve ? resolve(result) : result
                }
              },
            }
            return queryBuilder
          },
          order: async (orderBy: string, options?: { ascending?: boolean }) => {
            try {
              const response = await fetch(
                `${this.baseUrl}/api/mysql/${table}?orderBy=${orderBy}&ascending=${options?.ascending !== false}`
              )
              if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
                return { data: null, error: { message: errorData.error || "Request failed" } }
              }
              const data = await response.json()
              return { data: Array.isArray(data) ? data : [data], error: null }
            } catch (error: any) {
              return { data: null, error: { message: error.message || "Network error" } }
            }
          },
          limit: (limit: number) => ({
            single: async () => {
              try {
                const response = await fetch(`${this.baseUrl}/api/mysql/${table}?limit=${limit}&single=true`)
                if (!response.ok) {
                  const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
                  return { data: null, error: { message: errorData.error || "Request failed" } }
                }
                const data = await response.json()
                return { data: Array.isArray(data) ? data[0] : data, error: null }
              } catch (error: any) {
                return { data: null, error: { message: error.message || "Network error" } }
              }
            },
          }),
        }
        
        // Make query builder awaitable (for direct await like supabase.from().select())
        queryBuilder.then = async function(resolve?: (value: any) => any) {
          const response = await fetch(`${this.baseUrl}/api/mysql/${table}?orderBy=created_at&ascending=false`)
          if (!response.ok) {
            const result = { data: null, error: { message: "Error" } }
            return resolve ? resolve(result) : result
          }
          const data = await response.json()
          const result = { data: Array.isArray(data) ? data : [data], error: null }
          return resolve ? resolve(result) : result
        }
        
        return queryBuilder
      },
      insert: async (data: any) => {
        try {
          // Array veya tek obje kabul et
          const payload = Array.isArray(data) ? data : [data]
          
          const response = await fetch(`${this.baseUrl}/api/mysql/${table}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload[0]), // API tek obje bekliyor
          })
          
          if (!response.ok) {
            const errorData = await response.json()
            return { data: null, error: { message: errorData.error || "Insert failed" } }
          }
          
          const result = await response.json()
          return { data: result, error: null }
        } catch (error: any) {
          return { data: null, error: { message: error.message || "Network error" } }
        }
      },
      update: (data: any) => ({
        eq: async (column: string, value: any) => {
          const response = await fetch(`${this.baseUrl}/api/mysql/${table}?${column}=${encodeURIComponent(value)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          })
          const result = await response.json()
          return { data: result, error: null }
        },
      }),
      delete: () => ({
        eq: async (column: string, value: any) => {
          const response = await fetch(`${this.baseUrl}/api/mysql/${table}?${column}=${encodeURIComponent(value)}`, {
            method: "DELETE",
          })
          const result = await response.json()
          return { data: result, error: null }
        },
      }),
    }
  }

  auth = {
    getUser: async () => {
      const response = await fetch(`${this.baseUrl}/api/auth/user`)
      if (!response.ok) return { data: { user: null }, error: null }
      const user = await response.json()
      return { data: { user }, error: null }
    },
    signInWithPassword: async (credentials: { email: string; password: string }) => {
      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })
      const result = await response.json()
      if (!response.ok) {
        return { data: { user: null }, error: { message: result.error || "Login failed" } }
      }
      return { data: { user: result.user }, error: null }
    },
    signOut: async () => {
      await fetch(`${this.baseUrl}/api/auth/logout`, { method: "POST" })
      return { error: null }
    },
  }
}

export function createClient() {
  return new MySQLClient()
}

