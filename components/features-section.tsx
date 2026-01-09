import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { Users, FileText, Cpu, Headphones } from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users,
  "file-text": FileText,
  cpu: Cpu,
  headphones: Headphones,
}

export async function FeaturesSection() {
  const supabase = await createClient()

  const { data: features } = await supabase.from("features").select("*").order("order_index")

  // Get section texts from settings
  const getSetting = async (key: string, defaultValue: string) => {
    try {
      const { data } = await supabase.from("site_settings").select("setting_value").eq("setting_key", key).single()
      return data?.setting_value || defaultValue
    } catch {
      return defaultValue
    }
  }

  const featuresTitle = await getSetting("features_title", "Neden Biz?")
  const featuresSubtitle = await getSetting("features_subtitle", "Neden Bizi Tercih Etmelisiniz?")
  const featuresFooterText = await getSetting(
    "features_footer_text",
    "Dijital güvenliğiniz için yanınızdayız. Gaziantep'te tecrübemiz ve profesyonelliğimizle daima en iyi çözümleri sunuyoruz."
  )

  return (
    <section id="hakkimizda" className="py-20 bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{featuresTitle}</h2>
          <p className="text-xl text-slate-400">{featuresSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features?.map((feature) => {
            const IconComponent = feature.icon_name ? iconMap[feature.icon_name] : Users
            return (
              <div key={feature.id} className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                  {IconComponent && <IconComponent className="w-10 h-10 text-white" />}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-slate-300 italic">{featuresFooterText}</p>
        </div>
      </div>
    </section>
  )
}
