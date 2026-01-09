import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { Shield, Search, HardDrive, BookOpen, ShieldCheck, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: Shield,
  search: Search,
  "hard-drive": HardDrive,
  "book-open": BookOpen,
  "shield-check": ShieldCheck,
  scale: Scale,
}

export async function CategoriesSection() {
  const supabase = await createClient()

  let categories = null
  try {
    const { data } = await supabase.from("categories").select("*").order("order_index")
    categories = data
  } catch (error) {
    console.log("[v0] Categories table not found - run SQL script 003_add_news_and_categories.sql")
    return null
  }

  if (!categories || categories.length === 0) {
    return null
  }

  // Get section texts from settings
  const getSetting = async (key: string, defaultValue: string) => {
    try {
      const { data } = await supabase.from("site_settings").select("setting_value").eq("setting_key", key).single()
      return data?.setting_value || defaultValue
    } catch {
      return defaultValue
    }
  }

  const categoriesBadge = await getSetting("categories_badge", "Kategoriler")
  const categoriesTitlePart1 = await getSetting("categories_title_part1", "Ürün")
  const categoriesTitlePart2 = await getSetting("categories_title_part2", "Kategorilerimiz")
  const categoriesDescription = await getSetting(
    "categories_description",
    "Geniş yelpazedeki profesyonel ürünlerimizle tüm ihtiyaçlarınızı karşılıyoruz"
  )
  const categoriesButtonText = await getSetting("categories_button_text", "Daha Fazla")

  return (
    <section className="py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-4">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">{categoriesBadge}</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 text-balance">
            {categoriesTitlePart1}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {categoriesTitlePart2}
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto text-balance">{categoriesDescription}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {categories?.map((category, index) => {
            const IconComponent = category.icon_name ? iconMap[category.icon_name] : Shield

            return (
              <div
                key={category.id}
                className="group relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2"
              >
                {/* Glowing Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 rounded-2xl transition-all duration-500" />

                <div className="relative space-y-4">
                  {/* Icon or Image */}
                  {category.image_url ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                      <Image
                        src={category.image_url}
                        alt={category.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                      {IconComponent && <IconComponent className="w-8 h-8 text-white" />}
                    </div>
                  )}

                  {/* Category Number */}
                  <div className="absolute top-0 right-0 text-6xl font-bold text-slate-800/50 group-hover:text-cyan-500/20 transition-colors duration-500">
                    0{index + 1}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300 text-balance relative z-10">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300 text-balance relative z-10">
                    {category.description}
                  </p>

                  {/* Learn More Link */}
                  <Button
                    variant="ghost"
                    className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 font-semibold p-0 group-hover:translate-x-2 transition-transform duration-300"
                  >
                    {categoriesButtonText}
                    <span className="inline-block ml-2 group-hover:ml-3 transition-all duration-300">→</span>
                  </Button>
                </div>

                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
