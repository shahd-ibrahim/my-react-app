"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Save, Loader2 } from "lucide-react"
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface HeroSection {
  id: string
  title: string
  title_highlight: string | null
  description: string
  primary_button_text: string | null
  primary_button_link: string | null
  secondary_button_text: string | null
  secondary_button_link: string | null
  background_image_url: string | null
  is_active: boolean
  order_index: number
}

export function HeroManager() {
  const [heroes, setHeroes] = useState<HeroSection[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingHero, setEditingHero] = useState<HeroSection | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    title_highlight: "",
    description: "",
    primary_button_text: "",
    primary_button_link: "",
    secondary_button_text: "",
    secondary_button_link: "",
    background_image_url: "",
    is_active: true,
    order_index: 0,
  })

  const supabase = createClient()

  const loadHeroes = async () => {
    const { data } = await supabase.from("hero_sections").select("*").order("order_index")
    if (data) setHeroes(data)
  }

  useEffect(() => {
    loadHeroes()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingHero) {
        const { error } = await supabase.from("hero_sections").update(formData).eq("id", editingHero.id)
        if (error) throw error
        toast.success("Hero bölümü güncellendi")
      } else {
        const { error } = await supabase.from("hero_sections").insert(formData)
        if (error) throw error
        toast.success("Hero bölümü eklendi")
      }

      setIsOpen(false)
      setEditingHero(null)
      setFormData({
        title: "",
        title_highlight: "",
        description: "",
        primary_button_text: "",
        primary_button_link: "",
        secondary_button_text: "",
        secondary_button_link: "",
        background_image_url: "",
        is_active: true,
        order_index: 0,
      })
      loadHeroes()
    } catch (error) {
      toast.error("Bir hata oluştu")
      console.error(error)
    }
  }

  const handleEdit = (hero: HeroSection) => {
    setEditingHero(hero)
    setFormData({
      title: hero.title,
      title_highlight: hero.title_highlight || "",
      description: hero.description,
      primary_button_text: hero.primary_button_text || "",
      primary_button_link: hero.primary_button_link || "",
      secondary_button_text: hero.secondary_button_text || "",
      secondary_button_link: hero.secondary_button_link || "",
      background_image_url: hero.background_image_url || "",
      is_active: hero.is_active,
      order_index: hero.order_index,
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("hero_sections").delete().eq("id", id)
      if (error) throw error
      toast.success("Hero bölümü silindi")
      loadHeroes()
    } catch (error: any) {
      console.error("Error deleting hero:", error)
      toast.error(error.message || "Silme işlemi başarısız")
    }
  }

  const handleToggleActive = async (hero: HeroSection) => {
    await supabase.from("hero_sections").update({ is_active: !hero.is_active }).eq("id", hero.id)
    loadHeroes()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Hero Bölümü Yönetimi</h3>
          <p className="text-slate-400 text-sm">Ana sayfa hero bölümünü yönetin</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold"
              onClick={() => {
                setEditingHero(null)
                setFormData({
                  title: "",
                  title_highlight: "",
                  description: "",
                  primary_button_text: "",
                  primary_button_link: "",
                  secondary_button_text: "",
                  secondary_button_link: "",
                  background_image_url: "",
                  is_active: true,
                  order_index: 0,
                })
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Hero Bölümü
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingHero ? "Hero Bölümünü Düzenle" : "Yeni Hero Bölümü Ekle"}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Hero bölümü içeriğini düzenleyin
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">
                  Başlık
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title_highlight" className="text-white">
                  Vurgulanacak Başlık Kısmı
                </Label>
                <Input
                  id="title_highlight"
                  value={formData.title_highlight}
                  onChange={(e) => setFormData({ ...formData, title_highlight: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="Örn: Güvenlikte Güvenilir"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">
                  Açıklama
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary_button_text" className="text-white">
                    Birincil Buton Metni
                  </Label>
                  <Input
                    id="primary_button_text"
                    value={formData.primary_button_text}
                    onChange={(e) => setFormData({ ...formData, primary_button_text: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primary_button_link" className="text-white">
                    Birincil Buton Linki
                  </Label>
                  <Input
                    id="primary_button_link"
                    value={formData.primary_button_link}
                    onChange={(e) => setFormData({ ...formData, primary_button_link: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="secondary_button_text" className="text-white">
                    İkincil Buton Metni
                  </Label>
                  <Input
                    id="secondary_button_text"
                    value={formData.secondary_button_text}
                    onChange={(e) => setFormData({ ...formData, secondary_button_text: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary_button_link" className="text-white">
                    İkincil Buton Linki
                  </Label>
                  <Input
                    id="secondary_button_link"
                    value={formData.secondary_button_link}
                    onChange={(e) => setFormData({ ...formData, secondary_button_link: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>
              <ImageUpload
                value={formData.background_image_url || ""}
                onChange={(url) => setFormData({ ...formData, background_image_url: url })}
                label="Arka Plan Görseli"
              />
              <div className="space-y-2">
                <Label htmlFor="order_index" className="text-white">
                  Sıralama
                </Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
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
        {heroes.map((hero) => (
          <Card key={hero.id} className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-bold text-white">{hero.title}</h4>
                    {hero.title_highlight && (
                      <span className="text-cyan-400 font-semibold">{hero.title_highlight}</span>
                    )}
                    {hero.is_active && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">Aktif</span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm mb-2">{hero.description}</p>
                  <div className="flex gap-4 text-xs text-slate-500">
                    {hero.primary_button_text && <span>Buton 1: {hero.primary_button_text}</span>}
                    {hero.secondary_button_text && <span>Buton 2: {hero.secondary_button_text}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={hero.is_active} onCheckedChange={() => handleToggleActive(hero)} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(hero)}
                    className="border-slate-700 text-white hover:bg-slate-800"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-700 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-900 border-slate-800">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Hero Bölümünü Sil</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                          "{hero.title}" hero bölümünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
                          İptal
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(hero.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Sil
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

