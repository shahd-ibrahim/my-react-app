import mysql from "mysql2/promise"

// MySQL connection pool
let pool: mysql.Pool | null = null

export function resetPool() {
  if (pool) {
    pool.end()
    pool = null
  }
}

export function getPool(): mysql.Pool {
  if (!pool) {
    const config = {
      host: process.env.MYSQL_HOST || "mysql.railway.internal",
      port: parseInt(process.env.MYSQL_PORT || "3306"), // XAMPP default: 3307
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "rvzvnDXgAdGpoCyJGHqHsCjYDwUnOFBk",
      database: process.env.MYSQL_DATABASE || "railway",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: "utf8mb4",
    }
    
    console.log("MySQL Connection Config:", {
      host: config.host,
      port: config.port,
      user: config.user,
      database: config.database,
      password: config.password ? "***" : "(empty)"
    })
    
    pool = mysql.createPool(config)
  }
  return pool
}

export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  try {
    const connection = getPool()
    const [rows] = await connection.execute(sql, params || [])
    return rows as T[]
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorCode = (error as any)?.code || "UNKNOWN_ERROR"
    
    console.error("MySQL query error:", errorMessage)
    console.error("Error code:", errorCode)
    console.error("SQL:", sql)
    console.error("Params:", params)
    
    // Hata nesnesini daha iyi formatla
    const formattedError = new Error(`MySQL query failed: ${errorMessage}`)
    ;(formattedError as any).code = errorCode
    ;(formattedError as any).sql = sql
    ;(formattedError as any).params = params
    
    throw formattedError
  }
}

export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const results = await query<T>(sql, params)
  return results[0] || null
}

export async function execute(sql: string, params?: any[]): Promise<mysql.ResultSetHeader> {
  try {
    const connection = getPool()
    const [result] = await connection.execute(sql, params || [])
    return result as mysql.ResultSetHeader
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorCode = (error as any)?.code || "UNKNOWN_ERROR"
    
    console.error("MySQL execute error:", errorMessage)
    console.error("Error code:", errorCode)
    console.error("SQL:", sql)
    console.error("Params:", params)
    
    // Hata nesnesini daha iyi formatla
    const formattedError = new Error(`MySQL execute failed: ${errorMessage}`)
    ;(formattedError as any).code = errorCode
    ;(formattedError as any).sql = sql
    ;(formattedError as any).params = params
    
    throw formattedError
  }
}

