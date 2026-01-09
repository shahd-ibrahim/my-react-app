import { NextRequest, NextResponse } from "next/server"
import { query, queryOne, execute } from "@/lib/mysql/client"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/mysql/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> | { table: string } }
) {
  try {
    // Authentication check for GET requests
    const user = await getCurrentUser()
    if (!user || !(await isAdmin(user.id))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    
    // Handle both sync and async params (Next.js 15+ uses async params)
    let tableName: string | undefined
    if (params instanceof Promise) {
      const resolvedParams = await params
      tableName = resolvedParams?.table
    } else {
      tableName = params?.table
    }
    
    // Sanitize table name to prevent SQL injection
    const table = (tableName || "").replace(/[^a-zA-Z0-9_]/g, "")
    if (!table) {
      console.error("Invalid table name:", tableName, "Params:", params)
      return NextResponse.json({ error: "Invalid table name" }, { status: 400 })
    }
    
    // Allowed table names (whitelist approach for security)
    const allowedTables = [
      "services", "features", "contact_requests", "news", "categories",
      "hero_sections", "logos", "header_settings", "footer_settings", "site_settings",
      "admin_users"
    ]
    
    if (!allowedTables.includes(table)) {
      return NextResponse.json({ error: "Table not allowed" }, { status: 403 })
    }
    
    const orderBy = searchParams.get("orderBy")
    const ascending = searchParams.get("ascending") !== "false"
    const limit = searchParams.get("limit")
    
    // Get WHERE clause parameters (exclude orderBy, ascending, limit, single)
    const excludeParams = ["orderBy", "ascending", "limit", "single"]
    const whereParams: Array<{ key: string; value: string | string[] }> = []
    
    // Group parameters by key to handle IN clause (multiple values for same key)
    const paramMap = new Map<string, string[]>()
    
    for (const [key, value] of searchParams.entries()) {
      if (!excludeParams.includes(key) && value) {
        // Sanitize column name
        const sanitizedKey = key.replace(/[^a-zA-Z0-9_]/g, "")
        if (sanitizedKey) {
          if (!paramMap.has(sanitizedKey)) {
            paramMap.set(sanitizedKey, [])
          }
          paramMap.get(sanitizedKey)!.push(value)
        }
      }
    }

    // Convert map to array
    for (const [key, values] of paramMap.entries()) {
      whereParams.push({ key, value: values.length === 1 ? values[0] : values })
    }

    let sql = `SELECT * FROM \`${table}\``
    const sqlParams: any[] = []

    if (whereParams.length > 0) {
      const whereClauses: string[] = []
      whereParams.forEach((p) => {
        if (Array.isArray(p.value)) {
          // IN clause
          const placeholders = p.value.map(() => "?").join(", ")
          whereClauses.push(`\`${p.key}\` IN (${placeholders})`)
          sqlParams.push(...p.value)
        } else {
          // Equality
          whereClauses.push(`\`${p.key}\` = ?`)
          sqlParams.push(p.value)
        }
      })
      sql += ` WHERE ${whereClauses.join(" AND ")}`
    }

    if (orderBy) {
      // Sanitize orderBy to prevent SQL injection - only allow alphanumeric, underscore
      const sanitizedOrderBy = orderBy.replace(/[^a-zA-Z0-9_]/g, "")
      if (sanitizedOrderBy) {
        sql += ` ORDER BY \`${sanitizedOrderBy}\` ${ascending ? "ASC" : "DESC"}`
      }
    }

    if (limit) {
      sql += ` LIMIT ?`
      sqlParams.push(parseInt(limit))
    }

    console.log("Executing SQL:", sql)
    console.log("SQL Params:", sqlParams)
    console.log("Table:", table)
    
    try {
      const results = await query(sql, sqlParams)
      console.log("Query successful, results count:", results.length)

      if (limit === "1" || searchParams.get("single") === "true") {
        return NextResponse.json(results[0] || null)
      }

      return NextResponse.json(results)
    } catch (dbError: any) {
      console.error("Database query error:", dbError)
      console.error("SQL:", sql)
      console.error("Params:", sqlParams)
      return NextResponse.json({ 
        error: dbError.message || "Database query failed",
        sql: sql,
        details: dbError.code || "UNKNOWN"
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error("API Error:", error)
    console.error("Stack:", error.stack)
    return NextResponse.json({ 
      error: error.message || "Internal server error",
      details: error.code || "UNKNOWN"
    }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> | { table: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user || !(await isAdmin(user.id))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let tableName: string | undefined
    if (params instanceof Promise) {
      const resolvedParams = await params
      tableName = resolvedParams?.table
    } else {
      tableName = params?.table
    }
    
    const table = (tableName || "").replace(/[^a-zA-Z0-9_]/g, "")
    if (!table) {
      return NextResponse.json({ error: "Invalid table name" }, { status: 400 })
    }
    
    const body = await request.json()

    const columns = Object.keys(body).map(col => `\`${col.replace(/[^a-zA-Z0-9_]/g, "")}\``).join(", ")
    const placeholders = Object.keys(body).map(() => "?").join(", ")
    const values = Object.values(body)

    const sql = `INSERT INTO \`${table}\` (${columns}) VALUES (${placeholders})`
    const result = await execute(sql, values)

    return NextResponse.json({ id: result.insertId, ...body })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> | { table: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user || !(await isAdmin(user.id))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let tableName: string | undefined
    if (params instanceof Promise) {
      const resolvedParams = await params
      tableName = resolvedParams?.table
    } else {
      tableName = params?.table
    }
    
    const { searchParams } = new URL(request.url)
    const table = (tableName || "").replace(/[^a-zA-Z0-9_]/g, "")
    if (!table) {
      return NextResponse.json({ error: "Invalid table name" }, { status: 400 })
    }
    
    const body = await request.json()
    const column = searchParams.keys().next().value
    const value = searchParams.get(column || "")

    if (!column || !value) {
      return NextResponse.json({ error: "Missing where clause" }, { status: 400 })
    }

    const sanitizedColumn = (column || "").replace(/[^a-zA-Z0-9_]/g, "")
    const setClause = Object.keys(body)
      .map((key) => `\`${key.replace(/[^a-zA-Z0-9_]/g, "")}\` = ?`)
      .join(", ")
    const values = [...Object.values(body), value]

    const sql = `UPDATE \`${table}\` SET ${setClause} WHERE \`${sanitizedColumn}\` = ?`
    await execute(sql, values)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> | { table: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user || !(await isAdmin(user.id))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let tableName: string | undefined
    if (params instanceof Promise) {
      const resolvedParams = await params
      tableName = resolvedParams?.table
    } else {
      tableName = params?.table
    }
    
    const { searchParams } = new URL(request.url)
    const table = (tableName || "").replace(/[^a-zA-Z0-9_]/g, "")
    if (!table) {
      return NextResponse.json({ error: "Invalid table name" }, { status: 400 })
    }
    
    const column = searchParams.keys().next().value
    const value = searchParams.get(column || "")

    if (!column || !value) {
      return NextResponse.json({ error: "Missing where clause" }, { status: 400 })
    }
    
    // Sanitize column name
    const sanitizedColumn = column.replace(/[^a-zA-Z0-9_]/g, "")
    if (!sanitizedColumn) {
      return NextResponse.json({ error: "Invalid column name" }, { status: 400 })
    }

    const sql = `DELETE FROM \`${table}\` WHERE \`${sanitizedColumn}\` = ?`
    await execute(sql, [value])

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

