// Test database connection
import { getPool, query } from "../lib/mysql/client"

async function testConnection() {
  try {
    console.log("Testing database connection...")
    console.log("Environment variables:")
    console.log("MYSQL_HOST:", process.env.MYSQL_HOST || "mysql.railway.internal")
    console.log("MYSQL_PORT:", process.env.MYSQL_PORT || "3306")
    console.log("MYSQL_USER:", process.env.MYSQL_USER || "root")
    
    console.log("MYSQL_DATABASE:", process.env.MYSQL_DATABASE || "railway")
    
    const pool = getPool()
    console.log("Pool created successfully")
    
    // Test query
    const result = await query("SELECT 1 as test")
    console.log("Query test result:", result)
    
    // Check if admin_users table exists
    const tables = await query("SHOW TABLES LIKE 'admin_users'")
    console.log("admin_users table exists:", tables.length > 0)
    
    if (tables.length > 0) {
      const adminCount = await query("SELECT COUNT(*) as count FROM admin_users")
      console.log("Admin users count:", adminCount)
    }
    
    console.log("Database connection test successful!")
    process.exit(0)
  } catch (error: any) {
    console.error("Database connection test failed:")
    console.error("Error message:", error.message)
    console.error("Error code:", error.code)
    console.error("Error stack:", error.stack)
    process.exit(1)
  }
}

testConnection()

