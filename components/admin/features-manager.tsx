"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface Feature {
  id: string
  title: string
  description: string
  icon_name: string
  order_index: number
}

export function FeaturesManager() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon_name: "",
    order_index: 0,
  })

  const supabase = createClient()

  const loadFeatures = async () => {
    const { data } = await supabase.from("features").select("*").order("order_index")
    if (data) setFeatures(data)
  }

  useEffect(() => {
    loadFeatures()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingFeature) {
        const { error } = await supabase.from("features").update(formData).eq("id", editingFeature.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("features").insert(formData)
        if (error) throw error
      }

      setIsOpen(false)
      setEditingFeature(null)
      setFormData({ title: "", description: "", icon_name: "", order_index: 0 })
      loadFeatures()
    } catch (error: any) {
      console.error("Error saving feature:", error)
      alert(error.message || "Bir hata oluştu")
    }
  }

  const handleEdit = (feature: Feature) => {
    setEditingFeature(feature)
    setFormData({
      title: feature.title,
      description: feature.description,
      icon_name: feature.icon_name,
      order_index: feature.order_index,
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("features").delete().eq("id", id)
      if (error) throw error
      toast.success("Özellik silindi")
      loadFeatures()
    } catch (error: any) {
      console.error("Error deleting feature:", error)
      toast.error(error.message || "Silme işlemi başarısız")
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">Özellikler (Neden Biz?)</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingFeature(null)
                setFormData({ title: "", description: "", icon_name: "", order_index: 0 })
              }}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Özellik Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>{editingFeature ? "Özelliği Düzenle" : "Yeni Özellik Ekle"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Başlık</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <Label htmlFor="icon_name">İkon Adı (örn: users, file-text, cpu)</Label>
                <Input
                  id="icon_name"
                  value={formData.icon_name}
                  onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                  required
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <Label htmlFor="order_index">Sıra</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: Number.parseInt(e.target.value) })}
                  required
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950">
                {editingFeature ? "Güncelle" : "Ekle"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature) => (
          <Card key={feature.id} className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex justify-between items-start">
                <span>{feature.title}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(feature)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-900 border-slate-800">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Özelliği Sil</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                          "{feature.title}" özelliğini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
                          İptal
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(feature.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Sil
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm mb-2">{feature.description}</p>
              <div className="text-xs text-slate-500">
                <p>İkon: {feature.icon_name}</p>
                <p>Sıra: {feature.order_index}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
