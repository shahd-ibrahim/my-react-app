// Check if site_settings table has data
import { query } from "../lib/mysql/client"

async function checkSettings() {
  try {
    const settings = await query("SELECT * FROM site_settings ORDER BY setting_key")
    console.log("Total settings:", settings.length)
    console.log("\nSettings by section:")
    
    const services = settings.filter((s: any) => s.setting_key.startsWith("services_"))
    const categories = settings.filter((s: any) => s.setting_key.startsWith("categories_"))
    const features = settings.filter((s: any) => s.setting_key.startsWith("features_"))
    const contact = settings.filter((s: any) => s.setting_key.startsWith("contact_"))
    
    console.log("\nServices:", services.length)
    services.forEach((s: any) => console.log(`  - ${s.setting_key}: ${s.setting_value}`))
    
    console.log("\nCategories:", categories.length)
    categories.forEach((s: any) => console.log(`  - ${s.setting_key}: ${s.setting_value}`))
    
    console.log("\nFeatures:", features.length)
    features.forEach((s: any) => console.log(`  - ${s.setting_key}: ${s.setting_value}`))
    
    console.log("\nContact:", contact.length)
    contact.forEach((s: any) => console.log(`  - ${s.setting_key}: ${s.setting_value}`))
    
    process.exit(0)
  } catch (error: any) {
    console.error("Error:", error.message)
    process.exit(1)
  }
}

checkSettings()
