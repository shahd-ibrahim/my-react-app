import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export async function HeroSection() {
  const supabase = await createClient()

  // Get active hero section
  const { data: hero } = await supabase
    .from("hero_sections")
    .select("*")
    .eq("is_active", true)
    .order("order_index")
    .limit(1)
    .single()

  // Default values if no hero found
  const title = hero?.title || "Dijital Delilde Uzman,"
  const titleHighlight = hero?.title_highlight || "Güvenlikte Güvenilir"
  const description =
    hero?.description ||
    "Gaziantep Siber Güvenlik ve Kriminal Büro Danışmanlık olarak; siber güvenlik, adli bilişim, veri kurtarma ve geçiş kontrol çözümlerinde profesyonel hizmetinizdeyiz."
  const primaryButtonText = hero?.primary_button_text || "Hizmetlerimizi İnceleyin"
  const primaryButtonLink = hero?.primary_button_link || "#hizmetler"
  const secondaryButtonText = hero?.secondary_button_text || "Bizimle İletişime Geçin"
  const secondaryButtonLink = hero?.secondary_button_link || "#iletisim"
  const backgroundImageUrl = hero?.background_image_url || "/images/hero.jpeg"

  return (
    <section className="relative min-h-screen flex items-center pt-20">
      <div className="absolute inset-0 z-0">
        <Image src={backgroundImageUrl} alt="Hero Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-950/60" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-3xl">
          <h1 className="md:text-6xl font-bold text-white mb-6 leading-tight text-balance lg:text-xl text-sm">
            {title}{" "}
            {titleHighlight && (
              <>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  {titleHighlight}
                </span>{" "}
              </>
            )}
            Çözüm Ortağınız
          </h1>
          <p className="text-slate-300 leading-relaxed mb-8 md:text-lg text-xs">{description}</p>
          <div className="flex flex-wrap gap-4">
            {primaryButtonText && (
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-lg h-14 px-8"
              >
                <Link href={primaryButtonLink}>{primaryButtonText}</Link>
              </Button>
            )}
            {secondaryButtonText && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-cyan-400 text-white hover:bg-cyan-400/20 font-bold text-lg h-14 px-8 bg-transparent"
              >
                <Link href={secondaryButtonLink}>{secondaryButtonText}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent z-10" />
    </section>
  )
}
