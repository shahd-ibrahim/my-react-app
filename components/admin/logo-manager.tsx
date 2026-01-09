"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Save, Loader2, Edit } from "lucide-react"
import { toast } from "sonner"
import { ImageUpload } from "@/components/ui/image-upload"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Logo {
  id: string
  logo_type: "header" | "footer" | "favicon"
  image_url: string
  alt_text: string | null
  width: number | null
  height: number | null
  is_active: boolean
}

export function LogoManager() {
  const [logos, setLogos] = useState<Logo[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingLogo, setEditingLogo] = useState<Logo | null>(null)
  const [formData, setFormData] = useState({
    logo_type: "header" as "header" | "footer" | "favicon",
    image_url: "",
    alt_text: "",
    width: 60,
    height: 60,
    is_active: true,
  })

  const supabase = createClient()

  const loadLogos = async () => {
    try {
      const result = await supabase.from("logos").select("*").order("logo_type")
      if (result.data) setLogos(result.data)
      if (result.error) console.error("Error loading logos:", result.error)
    } catch (error: any) {
      console.error("Error loading logos:", error)
    }
  }

  useEffect(() => {
    loadLogos()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Eğer aktif logo varsa, önce onu pasif yap
      if (formData.is_active) {
        await supabase
          .from("logos")
          .update({ is_active: false })
          .eq("logo_type", formData.logo_type)
          .eq("is_active", true)
      }

      if (editingLogo) {
        const { error } = await supabase.from("logos").update(formData).eq("id", editingLogo.id)
        if (error) throw error
        toast.success("Logo güncellendi")
      } else {
        const { error } = await supabase.from("logos").insert(formData)
        if (error) throw error
        toast.success("Logo eklendi")
      }

      setIsOpen(false)
      setEditingLogo(null)
      setFormData({
        logo_type: "header",
        image_url: "",
        alt_text: "",
        width: 60,
        height: 60,
        is_active: true,
      })
      loadLogos()
    } catch (error) {
      toast.error("Bir hata oluştu")
      console.error(error)
    }
  }

  const handleEdit = (logo: Logo) => {
    setEditingLogo(logo)
    setFormData({
      logo_type: logo.logo_type,
      image_url: logo.image_url,
      alt_text: logo.alt_text || "",
      width: logo.width || 60,
      height: logo.height || 60,
      is_active: logo.is_active,
    })
    setIsOpen(true)
  }

  const handleToggleActive = async (logo: Logo) => {
    try {
      // Eğer aktif yapılıyorsa, aynı tipteki diğer logoları pasif yap
      if (!logo.is_active) {
        await supabase
          .from("logos")
          .update({ is_active: false })
          .eq("logo_type", logo.logo_type)
          .eq("is_active", true)
      }

      await supabase.from("logos").update({ is_active: !logo.is_active }).eq("id", logo.id)
      toast.success("Logo durumu güncellendi")
      loadLogos()
    } catch (error) {
      toast.error("Bir hata oluştu")
      console.error(error)
    }
  }

  const getLogoTypeLabel = (type: string) => {
    switch (type) {
      case "header":
        return "Header Logo"
      case "footer":
        return "Footer Logo"
      case "favicon":
        return "Favicon"
      default:
        return type
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Logo Yönetimi</h3>
          <p className="text-slate-400 text-sm">Site logolarını yönetin</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold"
              onClick={() => {
                setEditingLogo(null)
                setFormData({
                  logo_type: "header",
                  image_url: "",
                  alt_text: "",
                  width: 60,
                  height: 60,
                  is_active: true,
                })
              }}
            >
              Yeni Logo Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingLogo ? "Logoyu Düzenle" : "Yeni Logo Ekle"}
              </DialogTitle>
              <DialogDescription className="text-slate-400">Logo bilgilerini düzenleyin</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo_type" className="text-white">
                  Logo Tipi
                </Label>
                <select
                  id="logo_type"
                  value={formData.logo_type}
                  onChange={(e) =>
                    setFormData({ ...formData, logo_type: e.target.value as "header" | "footer" | "favicon" })
                  }
                  className="w-full p-2 bg-slate-800 border border-slate-700 text-white rounded-md"
                  required
                >
                  <option value="header">Header Logo</option>
                  <option value="footer">Footer Logo</option>
                  <option value="favicon">Favicon</option>
                </select>
              </div>
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                label="Logo Görseli"
              />
              <div className="space-y-2">
                <Label htmlFor="alt_text" className="text-white">
                  Alt Metin
                </Label>
                <Input
                  id="alt_text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="Logo açıklaması"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width" className="text-white">
                    Genişlik
                  </Label>
                  <Input
                    id="width"
                    type="number"
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: parseInt(e.target.value) || 60 })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-white">
                    Yükseklik
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 60 })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active" className="text-white">
                  Aktif
                </Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="border-slate-700 text-white hover:bg-slate-800"
                >
                  İptal
                </Button>
                <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                  <Save className="w-4 h-4 mr-2" />
                  Kaydet
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {logos.map((logo) => (
          <Card key={logo.id} className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-800 rounded flex items-center justify-center overflow-hidden">
                    {logo.image_url && (
                      <img src={logo.image_url} alt={logo.alt_text || ""} className="w-full h-full object-contain" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{getLogoTypeLabel(logo.logo_type)}</h4>
                    <p className="text-slate-400 text-sm">{logo.image_url}</p>
                    <div className="flex gap-4 text-xs text-slate-500 mt-1">
                      <span>
                        {logo.width}x{logo.height}
                      </span>
                      {logo.is_active && <span className="text-green-400">Aktif</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={logo.is_active} onCheckedChange={() => handleToggleActive(logo)} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(logo)}
                    className="border-slate-700 text-white hover:bg-slate-800"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

