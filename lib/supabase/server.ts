// MySQL server client
import { query, queryOne, execute } from "@/lib/mysql/client"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/mysql/server"

// Helper to parse JSON fields
function parseJsonFields(obj: any): any {
  if (!obj || typeof obj !== "object") return obj
  const parsed = { ...obj }
  for (const key in parsed) {
    if (typeof parsed[key] === "string" && (parsed[key].startsWith("[") || parsed[key].startsWith("{"))) {
      try {
        parsed[key] = JSON.parse(parsed[key])
      } catch {
        // Not JSON, keep as is
      }
    }
  }
  return parsed
}

export async function createClient() {
  const user = await getCurrentUser()

  return {
    from: (table: string) => ({
      select: (columns: string = "*") => {
        // Build query with chainable methods
        const queryBuilder = {
          whereConditions: [] as Array<{ column: string; value: any; operator: string }>,
          orderBy: null as { column: string; ascending: boolean } | null,
          limitValue: null as number | null,
          
          eq: function(column: string, value: any) {
            this.whereConditions.push({ column, value, operator: "=" })
            return this
          },
          
          in: function(column: string, values: any[]) {
            this.whereConditions.push({ column, value: values, operator: "IN" })
            return this
          },
          
          order: function(orderBy: string, options?: { ascending?: boolean }) {
            this.orderBy = { column: orderBy, ascending: options?.ascending !== false }
            return this
          },
          
          limit: function(limit: number) {
            this.limitValue = limit
            return this
          },
          
          single: async function() {
            try {
              let sql = `SELECT ${columns} FROM ${table}`
              const params: any[] = []
              
              if (this.whereConditions.length > 0) {
                const conditions = this.whereConditions.map((cond) => {
                  if (cond.operator === "IN") {
                    const placeholders = (cond.value as any[]).map(() => "?").join(", ")
                    params.push(...(cond.value as any[]))
                    return `${cond.column} IN (${placeholders})`
                  } else {
                    params.push(cond.value)
                    return `${cond.column} = ?`
                  }
                })
                sql += ` WHERE ${conditions.join(" AND ")}`
              }
              
              if (this.orderBy) {
                sql += ` ORDER BY ${this.orderBy.column} ${this.orderBy.ascending ? "ASC" : "DESC"}`
              }
              
              if (this.limitValue) {
                sql += ` LIMIT ?`
                params.push(this.limitValue)
              } else {
                sql += ` LIMIT 1`
              }
              
              const result = await queryOne(sql, params)
              return { data: result ? parseJsonFields(result) : null, error: null }
            } catch (error: any) {
              return { data: null, error: { message: error.message } }
            }
          },
          
          // Make query builder awaitable
          then: async function(resolve?: (value: any) => any, reject?: (reason: any) => any) {
            try {
              let sql = `SELECT ${columns} FROM ${table}`
              const params: any[] = []
              
              if (this.whereConditions.length > 0) {
                const conditions = this.whereConditions.map((cond: any) => {
                  if (cond.operator === "IN") {
                    const placeholders = (cond.value as any[]).map(() => "?").join(", ")
                    params.push(...(cond.value as any[]))
                    return `${cond.column} IN (${placeholders})`
                  } else {
                    params.push(cond.value)
                    return `${cond.column} = ?`
                  }
                })
                sql += ` WHERE ${conditions.join(" AND ")}`
              }
              
              if (this.orderBy) {
                sql += ` ORDER BY ${this.orderBy.column} ${this.orderBy.ascending ? "ASC" : "DESC"}`
              }
              
              if (this.limitValue) {
                sql += ` LIMIT ?`
                params.push(this.limitValue)
              }
              
              const results = await query(sql, params)
              const parsedResults = results.map((row: any) => parseJsonFields(row))
              const result = { data: parsedResults, error: null }
              return resolve ? resolve(result) : result
            } catch (error: any) {
              const result = { data: null, error: { message: error.message } }
              if (reject) {
                return reject(error)
              }
              return result
            }
          },
          
          catch: async function(reject: (reason: any) => any) {
            try {
              return await this.then()
            } catch (error: any) {
              return reject(error)
            }
          },
        }
        
        return queryBuilder
      },
      insert: async (data: any) => {
        try {
          if (!user || !(await isAdmin(user.id))) {
            return { data: null, error: { message: "Unauthorized" } }
          }
          const columns = Object.keys(data).join(", ")
          const placeholders = Object.keys(data).map(() => "?").join(", ")
          const values = Object.values(data)
          const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`
          await execute(sql, values)
          return { data, error: null }
        } catch (error: any) {
          return { data: null, error: { message: error.message } }
        }
      },
      update: (data: any) => ({
        eq: async (column: string, value: any) => {
          try {
            if (!user || !(await isAdmin(user.id))) {
              return { data: null, error: { message: "Unauthorized" } }
            }
            const setClause = Object.keys(data)
              .map((key) => `${key} = ?`)
              .join(", ")
            const values = [...Object.values(data), value]
            const sql = `UPDATE ${table} SET ${setClause} WHERE ${column} = ?`
            await execute(sql, values)
            return { data, error: null }
          } catch (error: any) {
            return { data: null, error: { message: error.message } }
          }
        },
      }),
      delete: () => ({
        eq: async (column: string, value: any) => {
          try {
            if (!user || !(await isAdmin(user.id))) {
              return { data: null, error: { message: "Unauthorized" } }
            }
            const sql = `DELETE FROM ${table} WHERE ${column} = ?`
            await execute(sql, [value])
            return { data: null, error: null }
          } catch (error: any) {
            return { data: null, error: { message: error.message } }
          }
        },
      }),
    }),
    auth: {
      getUser: async () => {
        try {
          const currentUser = await getCurrentUser()
          if (!currentUser) {
            return { data: { user: null }, error: null }
          }
          const adminUser = await queryOne<{
            id: string
            email: string
            full_name: string | null
          }>("SELECT id, email, full_name FROM admin_users WHERE id = ?", [currentUser.id])
          return { data: { user: adminUser }, error: null }
        } catch (error: any) {
          return { data: { user: null }, error: { message: error.message } }
        }
      },
    },
  }
}
