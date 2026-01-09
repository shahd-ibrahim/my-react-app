import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { Shield, Search, HardDrive, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "shield-check": Shield,
  search: Search,
  "hard-drive": HardDrive,
  lock: Lock,
}

export async function ServicesSection() {
  const supabase = await createClient()

  const { data: services } = await supabase.from("services").select("*").order("order_index")

  // Get section texts from settings
  const getSetting = async (key: string, defaultValue: string) => {
    try {
      const { data } = await supabase.from("site_settings").select("setting_value").eq("setting_key", key).single()
      return data?.setting_value || defaultValue
    } catch {
      return defaultValue
    }
  }

  const servicesBadge = await getSetting("services_badge", "Hizmetlerimiz")
  const servicesTitlePart1 = await getSetting("services_title_part1", "Uzmanlık")
  const servicesTitlePart2 = await getSetting("services_title_part2", "Alanlarımız")
  const servicesDescription = await getSetting(
    "services_description",
    "Dijital güvenlik ve adli bilişim alanında profesyonel hizmetlerimizle yanınızdayız"
  )
  const servicesButtonText = await getSetting("services_button_text", "Detaylı İncele")

  const serviceImageMap: Record<string, string> = {
    "Siber Güvenlik": "/images/cyber-security-service.jpg",
    "Adli Bilişim": "/images/forensic-service.jpg",
    "Veri Kurtarma": "/images/data-recovery-service.jpg",
    "Geçiş Kontrol ve Güvenlik Sistemleri": "/images/access-control-service.jpg",
  }

  return (
    <section
      id="hizmetler"
      className="py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-4">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">{servicesBadge}</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 text-balance">
            {servicesTitlePart1}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {servicesTitlePart2}
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto text-balance">{servicesDescription}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {services?.map((service, index) => {
            const IconComponent = service.icon_name ? iconMap[service.icon_name] : Shield
            const imageUrl = serviceImageMap[service.title] || service.image_url || "/placeholder.svg"

            return (
              <div
                key={service.id}
                className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20"
              >
                {/* Glowing Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative flex flex-col md:flex-row gap-6 p-8">
                  {/* Image Section */}
                  <div className="relative w-full md:w-48 h-48 flex-shrink-0 rounded-xl overflow-hidden">
                    <Image
                      src={imageUrl || "/placeholder.svg"}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

                    {/* Floating Icon */}
                    {IconComponent && (
                      <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Service Number Badge */}
                      <div className="inline-flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center">
                          <span className="text-cyan-400 font-bold text-sm">0{index + 1}</span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent max-w-[60px]" />
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300 text-balance">
                        {service.title}
                      </h3>
                      <p className="text-slate-300 leading-relaxed text-balance">{service.description}</p>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-6">
                      <Button
                        variant="ghost"
                        asChild
                        className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 font-semibold p-0 group-hover:translate-x-2 transition-transform duration-300"
                      >
                        <Link href={`/services/${service.id}`}>
                          {servicesButtonText}
                          <span className="inline-block ml-2 group-hover:ml-3 transition-all duration-300">→</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
