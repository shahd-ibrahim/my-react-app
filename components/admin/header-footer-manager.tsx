"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface NavigationLink {
  label: string
  href: string
}

interface HeaderSettings {
  id: string
  site_name: string
  site_tagline: string | null
  phone_number: string | null
  cta_button_text: string | null
  cta_button_link: string | null
  navigation_links: NavigationLink[]
}

interface FooterSettings {
  id: string
  description: string | null
  phone_number: string | null
  email: string | null
  address: string | null
  quick_links: NavigationLink[]
  copyright_text: string | null
  legal_links: NavigationLink[]
}

export function HeaderFooterManager() {
  const [headerSettings, setHeaderSettings] = useState<HeaderSettings | null>(null)
  const [footerSettings, setFooterSettings] = useState<FooterSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [headerFormData, setHeaderFormData] = useState({
    site_name: "",
    site_tagline: "",
    phone_number: "",
    cta_button_text: "",
    cta_button_link: "",
    navigation_links: [] as NavigationLink[],
  })

  const [footerFormData, setFooterFormData] = useState({
    description: "",
    phone_number: "",
    email: "",
    address: "",
    quick_links: [] as NavigationLink[],
    copyright_text: "",
    legal_links: [] as NavigationLink[],
  })

  const supabase = createClient()

  const loadSettings = async () => {
    setLoading(true)
    try {
      const { data: headerData } = await supabase.from("header_settings").select("*").limit(1).single()
      const { data: footerData } = await supabase.from("footer_settings").select("*").limit(1).single()

      if (headerData) {
        setHeaderSettings(headerData)
        
        // Parse JSON fields if they are strings
        let navigationLinks: NavigationLink[] = []
        if (headerData.navigation_links) {
          if (typeof headerData.navigation_links === 'string') {
            try {
              navigationLinks = JSON.parse(headerData.navigation_links)
            } catch (e) {
              console.error("Error parsing navigation_links:", e)
              navigationLinks = []
            }
          } else if (Array.isArray(headerData.navigation_links)) {
            navigationLinks = headerData.navigation_links
          }
        }
        
        setHeaderFormData({
          site_name: headerData.site_name || "",
          site_tagline: headerData.site_tagline || "",
          phone_number: headerData.phone_number || "",
          cta_button_text: headerData.cta_button_text || "",
          cta_button_link: headerData.cta_button_link || "",
          navigation_links: navigationLinks,
        })
      }

      if (footerData) {
        setFooterSettings(footerData)
        
        // Parse JSON fields if they are strings
        let quickLinks: NavigationLink[] = []
        if (footerData.quick_links) {
          if (typeof footerData.quick_links === 'string') {
            try {
              quickLinks = JSON.parse(footerData.quick_links)
            } catch (e) {
              console.error("Error parsing quick_links:", e)
              quickLinks = []
            }
          } else if (Array.isArray(footerData.quick_links)) {
            quickLinks = footerData.quick_links
          }
        }
        
        let legalLinks: NavigationLink[] = []
        if (footerData.legal_links) {
          if (typeof footerData.legal_links === 'string') {
            try {
              legalLinks = JSON.parse(footerData.legal_links)
            } catch (e) {
              console.error("Error parsing legal_links:", e)
              legalLinks = []
            }
          } else if (Array.isArray(footerData.legal_links)) {
            legalLinks = footerData.legal_links
          }
        }
        
        setFooterFormData({
          description: footerData.description || "",
          phone_number: footerData.phone_number || "",
          email: footerData.email || "",
          address: footerData.address || "",
          quick_links: quickLinks,
          copyright_text: footerData.copyright_text || "",
          legal_links: legalLinks,
        })
      }
    } catch (error: any) {
      console.error("Error loading settings:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const handleSaveHeader = async () => {
    setSaving(true)
    try {
      // Ensure JSON fields are properly stringified for MySQL
      const dataToSave = {
        ...headerFormData,
        navigation_links: JSON.stringify(headerFormData.navigation_links),
      }
      
      if (headerSettings) {
        const { error } = await supabase.from("header_settings").update(dataToSave).eq("id", headerSettings.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("header_settings").insert(dataToSave)
        if (error) throw error
      }
      toast.success("Header ayarları kaydedildi")
      await loadSettings()
    } catch (error) {
      toast.error("Bir hata oluştu")
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveFooter = async () => {
    setSaving(true)
    try {
      // Ensure JSON fields are properly stringified for MySQL
      const dataToSave = {
        ...footerFormData,
        quick_links: JSON.stringify(footerFormData.quick_links),
        legal_links: JSON.stringify(footerFormData.legal_links),
      }
      
      if (footerSettings) {
        const { error } = await supabase.from("footer_settings").update(dataToSave).eq("id", footerSettings.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("footer_settings").insert(dataToSave)
        if (error) throw error
      }
      toast.success("Footer ayarları kaydedildi")
      await loadSettings()
    } catch (error) {
      toast.error("Bir hata oluştu")
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const addNavigationLink = (type: "header" | "footer" | "legal") => {
    if (type === "header") {
      setHeaderFormData({
        ...headerFormData,
        navigation_links: [...headerFormData.navigation_links, { label: "", href: "" }],
      })
    } else if (type === "footer") {
      setFooterFormData({
        ...footerFormData,
        quick_links: [...footerFormData.quick_links, { label: "", href: "" }],
      })
    } else {
      setFooterFormData({
        ...footerFormData,
        legal_links: [...footerFormData.legal_links, { label: "", href: "" }],
      })
    }
  }

  const removeNavigationLink = (index: number, type: "header" | "footer" | "legal") => {
    if (type === "header") {
      setHeaderFormData({
        ...headerFormData,
        navigation_links: headerFormData.navigation_links.filter((_, i) => i !== index),
      })
    } else if (type === "footer") {
      setFooterFormData({
        ...footerFormData,
        quick_links: footerFormData.quick_links.filter((_, i) => i !== index),
      })
    } else {
      setFooterFormData({
        ...footerFormData,
        legal_links: footerFormData.legal_links.filter((_, i) => i !== index),
      })
    }
  }

  const updateNavigationLink = (
    index: number,
    field: "label" | "href",
    value: string,
    type: "header" | "footer" | "legal"
  ) => {
    if (type === "header") {
      const links = [...headerFormData.navigation_links]
      links[index] = { ...links[index], [field]: value }
      setHeaderFormData({ ...headerFormData, navigation_links: links })
    } else if (type === "footer") {
      const links = [...footerFormData.quick_links]
      links[index] = { ...links[index], [field]: value }
      setFooterFormData({ ...footerFormData, quick_links: links })
    } else {
      const links = [...footerFormData.legal_links]
      links[index] = { ...links[index], [field]: value }
      setFooterFormData({ ...footerFormData, legal_links: links })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
      </div>
    )
  }

  return (
    <Tabs defaultValue="header" className="w-full">
      <TabsList className="bg-slate-900 border border-slate-800 mb-6">
        <TabsTrigger value="header" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">
          Header Ayarları
        </TabsTrigger>
        <TabsTrigger value="footer" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">
          Footer Ayarları
        </TabsTrigger>
      </TabsList>

      <TabsContent value="header">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Header Ayarları</CardTitle>
            <CardDescription className="text-slate-400">Header bölümü ayarlarını yönetin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site_name" className="text-white">
                Site Adı
              </Label>
              <Input
                id="site_name"
                value={headerFormData.site_name}
                onChange={(e) => setHeaderFormData({ ...headerFormData, site_name: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site_tagline" className="text-white">
                Site Sloganı
              </Label>
              <Input
                id="site_tagline"
                value={headerFormData.site_tagline}
                onChange={(e) => setHeaderFormData({ ...headerFormData, site_tagline: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number" className="text-white">
                Telefon Numarası
              </Label>
              <Input
                id="phone_number"
                value={headerFormData.phone_number}
                onChange={(e) => setHeaderFormData({ ...headerFormData, phone_number: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cta_button_text" className="text-white">
                  CTA Buton Metni
                </Label>
                <Input
                  id="cta_button_text"
                  value={headerFormData.cta_button_text}
                  onChange={(e) => setHeaderFormData({ ...headerFormData, cta_button_text: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta_button_link" className="text-white">
                  CTA Buton Linki
                </Label>
                <Input
                  id="cta_button_link"
                  value={headerFormData.cta_button_link}
                  onChange={(e) => setHeaderFormData({ ...headerFormData, cta_button_link: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-white">Navigasyon Linkleri</Label>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => addNavigationLink("header")}
                  className="bg-slate-800 hover:bg-slate-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Link Ekle
                </Button>
              </div>
              {headerFormData.navigation_links.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={link.label}
                    onChange={(e) => updateNavigationLink(index, "label", e.target.value, "header")}
                    placeholder="Label"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <Input
                    value={link.href}
                    onChange={(e) => updateNavigationLink(index, "href", e.target.value, "header")}
                    placeholder="URL"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeNavigationLink(index, "header")}
                    className="border-red-700 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              onClick={handleSaveHeader}
              disabled={saving}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Kaydet
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="footer">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Footer Ayarları</CardTitle>
            <CardDescription className="text-slate-400">Footer bölümü ayarlarını yönetin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">
                Açıklama
              </Label>
              <Textarea
                id="description"
                value={footerFormData.description}
                onChange={(e) => setFooterFormData({ ...footerFormData, description: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone_number" className="text-white">
                  Telefon
                </Label>
                <Input
                  id="phone_number"
                  value={footerFormData.phone_number}
                  onChange={(e) => setFooterFormData({ ...footerFormData, phone_number: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  E-posta
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={footerFormData.email}
                  onChange={(e) => setFooterFormData({ ...footerFormData, email: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-white">
                  Adres
                </Label>
                <Input
                  id="address"
                  value={footerFormData.address}
                  onChange={(e) => setFooterFormData({ ...footerFormData, address: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="copyright_text" className="text-white">
                Telif Hakkı Metni
              </Label>
              <Input
                id="copyright_text"
                value={footerFormData.copyright_text}
                onChange={(e) => setFooterFormData({ ...footerFormData, copyright_text: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-white">Hızlı Bağlantılar</Label>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => addNavigationLink("footer")}
                  className="bg-slate-800 hover:bg-slate-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Link Ekle
                </Button>
              </div>
              {footerFormData.quick_links.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={link.label}
                    onChange={(e) => updateNavigationLink(index, "label", e.target.value, "footer")}
                    placeholder="Label"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <Input
                    value={link.href}
                    onChange={(e) => updateNavigationLink(index, "href", e.target.value, "footer")}
                    placeholder="URL"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeNavigationLink(index, "footer")}
                    className="border-red-700 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-white">Yasal Linkler</Label>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => addNavigationLink("legal")}
                  className="bg-slate-800 hover:bg-slate-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Link Ekle
                </Button>
              </div>
              {footerFormData.legal_links.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={link.label}
                    onChange={(e) => updateNavigationLink(index, "label", e.target.value, "legal")}
                    placeholder="Label"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <Input
                    value={link.href}
                    onChange={(e) => updateNavigationLink(index, "href", e.target.value, "legal")}
                    placeholder="URL"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeNavigationLink(index, "legal")}
                    className="border-red-700 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              onClick={handleSaveFooter}
              disabled={saving}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Kaydet
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

