"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface SiteSetting {
  id: string
  setting_key: string
  setting_value: string | null
  setting_type: string
  description: string | null
}

export function SiteSettingsManager() {
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({})

  const supabase = createClient()

  const loadSettings = async () => {
    setLoading(true)
    try {
      // Use order() method which returns a Promise
      const result = await supabase.from("site_settings").select("*").order("setting_key")
      
      console.log("Site settings loaded:", result)
      
      if (result && result.data) {
        setSettings(result.data)
        const initialFormData: Record<string, string> = {}
        result.data.forEach((setting) => {
          initialFormData[setting.setting_key] = setting.setting_value || ""
        })
        setFormData(initialFormData)
        console.log("Settings count:", result.data.length)
      } else if (result && result.error) {
        console.error("Error loading settings:", result.error)
        toast.error("Ayarlar yüklenirken bir hata oluştu: " + result.error.message)
      } else {
        console.warn("No data or error returned from query")
        toast.error("Ayarlar yüklenemedi")
      }
    } catch (error: any) {
      console.error("Error in loadSettings:", error)
      toast.error("Ayarlar yüklenirken bir hata oluştu: " + (error.message || "Bilinmeyen hata"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      for (const [key, value] of Object.entries(formData)) {
        await supabase.from("site_settings").update({ setting_value: value }).eq("setting_key", key)
      }
      toast.success("Ayarlar başarıyla kaydedildi")
      await loadSettings()
    } catch (error) {
      toast.error("Ayarlar kaydedilirken bir hata oluştu")
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
      </div>
    )
  }

  // Group settings by section
  const groupedSettings = {
    services: settings.filter((s) => s.setting_key.startsWith("services_")),
    categories: settings.filter((s) => s.setting_key.startsWith("categories_")),
    features: settings.filter((s) => s.setting_key.startsWith("features_")),
    contact: settings.filter((s) => s.setting_key.startsWith("contact_")),
    general: settings.filter(
      (s) =>
        !s.setting_key.startsWith("services_") &&
        !s.setting_key.startsWith("categories_") &&
        !s.setting_key.startsWith("features_") &&
        !s.setting_key.startsWith("contact_")
    ),
  }

  const renderSection = (title: string, sectionSettings: SiteSetting[]) => {
    if (sectionSettings.length === 0) return null

    return (
      <Card key={title} className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">{title}</CardTitle>
          <CardDescription className="text-slate-400">
            {title} bölümündeki metinleri düzenleyin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sectionSettings.map((setting) => (
            <div key={setting.id} className="space-y-2">
              <Label htmlFor={setting.setting_key} className="text-white">
                {setting.description || setting.setting_key}
              </Label>
              <Input
                id={setting.setting_key}
                type={setting.setting_type === "email" ? "email" : setting.setting_type === "phone" ? "tel" : "text"}
                value={formData[setting.setting_key] || ""}
                onChange={(e) => setFormData({ ...formData, [setting.setting_key]: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder={setting.description || setting.setting_key}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {renderSection("Hizmetler Bölümü", groupedSettings.services)}
      {renderSection("Kategoriler Bölümü", groupedSettings.categories)}
      {renderSection("Özellikler Bölümü", groupedSettings.features)}
      {renderSection("İletişim Bölümü", groupedSettings.contact)}
      {renderSection("Genel Ayarlar", groupedSettings.general)}

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="pt-6">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Tüm Ayarları Kaydet
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

