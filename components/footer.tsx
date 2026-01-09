import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"

interface NavigationLink {
  label: string
  href: string
}

export async function Footer() {
  const supabase = await createClient()

  // Get footer logo
  const { data: footerLogo } = await supabase
    .from("logos")
    .select("*")
    .eq("logo_type", "footer")
    .eq("is_active", true)
    .single()

  // Get footer settings
  const { data: footerSettings } = await supabase.from("footer_settings").select("*").limit(1).single()

  // Get site settings for fallback
  const { data: siteSettingsData } = await supabase
    .from("site_settings")
    .select("*")
    .in("setting_key", ["site_name", "site_tagline"])

  const siteSettings: Record<string, string> = {}
  siteSettingsData?.forEach((setting) => {
    siteSettings[setting.setting_key] = setting.setting_value || ""
  })

  const logoUrl = footerLogo?.image_url || "/images/logo.jpeg"
  const logoAlt = footerLogo?.alt_text || "Gaziantep Kriminal Büro"
  const logoWidth = footerLogo?.width || 50
  const logoHeight = footerLogo?.height || 50

  const siteName = siteSettings.site_name || "GAZİANTEP KRİMİNAL BÜRO"
  const siteTagline = siteSettings.site_tagline || "Siber & Güvenlik Teknolojileri"
  const description =
    footerSettings?.description ||
    "Dijital güvenliğiniz için yanınızdayız. Gaziantep'te tecrübemiz ile profesyonel hizmetimizeyiz."
  const phoneNumber = footerSettings?.phone_number || "+90 342 123 45 67"
  const email = footerSettings?.email || "info@gaziantepkriminalburo.com"
  const address = footerSettings?.address || "Gaziantep, Türkiye"
  const quickLinks: NavigationLink[] = (footerSettings?.quick_links as NavigationLink[]) || [
    { label: "Hizmetler", href: "#hizmetler" },
    { label: "Hakkımızda", href: "#hakkimizda" },
    { label: "İletişim", href: "#iletisim" },
  ]
  const copyrightText = footerSettings?.copyright_text || "© 2023 Gaziantep Kriminal Büro · Tüm Hakları Saklıdır"
  const legalLinks: NavigationLink[] = (footerSettings?.legal_links as NavigationLink[]) || [
    { label: "KVKK", href: "#" },
    { label: "Gizlilik Politikası", href: "#" },
  ]

  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image src={logoUrl} alt={logoAlt} width={logoWidth} height={logoHeight} className="object-contain" />
              <div className="flex flex-col">
                <span className="text-white font-bold text-base leading-tight">{siteName}</span>
                <span className="text-cyan-400 text-xs font-semibold leading-tight">{siteTagline}</span>
              </div>
            </div>
            {description && <p className="text-slate-400 text-sm">{description}</p>}
          </div>

          {/* Quick Links */}
          {quickLinks.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-white font-bold text-lg mb-2">Hızlı Bağlantılar</h3>
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Contact Info */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-bold text-lg mb-2">İletişim</h3>
            {phoneNumber && <p className="text-slate-400 text-sm">Telefon: {phoneNumber}</p>}
            {email && <p className="text-slate-400 text-sm">E-posta: {email}</p>}
            {address && <p className="text-slate-400 text-sm">Adres: {address}</p>}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {copyrightText && (
            <div className="text-slate-400 text-sm text-center md:text-left">{copyrightText}</div>
          )}
          {legalLinks.length > 0 && (
            <div className="flex items-center gap-6">
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
