import Link from "next/link"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"

interface NavigationLink {
  label: string
  href: string
}

export async function Header() {
  const supabase = await createClient()

  // Get header logo
  const { data: headerLogo } = await supabase
    .from("logos")
    .select("*")
    .eq("logo_type", "header")
    .eq("is_active", true)
    .single()

  // Get header settings
  const { data: headerSettings } = await supabase.from("header_settings").select("*").limit(1).single()

  const logoUrl = headerLogo?.image_url || "/images/logo.jpeg"
  const logoAlt = headerLogo?.alt_text || "Gaziantep Kriminal Büro"
  const logoWidth = headerLogo?.width || 60
  const logoHeight = headerLogo?.height || 60

  const siteName = headerSettings?.site_name || "GAZİANTEP KRİMİNAL BÜRO"
  const siteTagline = headerSettings?.site_tagline || "Siber & Güvenlik Teknolojileri"
  const phoneNumber = headerSettings?.phone_number || "+90 342 123 45 67"
  const ctaButtonText = headerSettings?.cta_button_text || "Teklif Alın"
  const ctaButtonLink = headerSettings?.cta_button_link || "#iletisim"
  const navigationLinks: NavigationLink[] = (headerSettings?.navigation_links as NavigationLink[]) || [
    { label: "Anasayfa", href: "/" },
    { label: "Hizmetler", href: "#hizmetler" },
    { label: "Hakkımızda", href: "#hakkimizda" },
    { label: "İletişim", href: "#iletisim" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <Image src={logoUrl} alt={logoAlt} width={logoWidth} height={logoHeight} className="object-contain" />
            <div className="flex flex-col">
              <span className="text-white font-bold leading-tight text-sm">{siteName}</span>
              <span className="text-cyan-400 text-xs font-semibold leading-tight">{siteTagline}</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigationLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-white hover:text-cyan-400 transition-colors font-medium leading-4"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Contact Info & CTA */}
          <div className="flex items-center gap-4">
            {phoneNumber && (
              <div className="hidden lg:flex items-center gap-2 text-white">
                <Phone className="w-4 h-4" />
                <span className="font-medium">{phoneNumber}</span>
              </div>
            )}
            {ctaButtonText && (
              <Button
                asChild
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold"
              >
                <Link href={ctaButtonLink}>{ctaButtonText}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
