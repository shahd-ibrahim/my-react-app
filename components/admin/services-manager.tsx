"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminDialog } from "./admin-dialog"
import { ServiceDetailManager } from "./service-detail-manager"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { ImageUpload } from "@/components/ui/image-upload"
import Image from "next/image"
import { toast } from "sonner"

interface Service {
  id: string
  title: string
  description: string
  image_url: string
  detail_image_url: string | null
  detail_content: string | null
  experience_years: number | null
  experience_description: string | null
  benefits: string | null
  features: string | null
  gallery_images: string | null
  icon_name: string
  order_index: number
}

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    icon_name: "",
    order_index: 0,
  })

  const supabase = createClient()

  const loadServices = async () => {
    const { data } = await supabase.from("services").select("*").order("order_index")
    if (data) setServices(data)
  }

  useEffect(() => {
    loadServices()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingService) {
        const { error } = await supabase.from("services").update(formData).eq("id", editingService.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("services").insert(formData)
        if (error) throw error
      }

      setIsOpen(false)
      setEditingService(null)
      setFormData({ title: "", description: "", image_url: "", icon_name: "", order_index: 0 })
      toast.success(editingService ? "Hizmet güncellendi" : "Hizmet eklendi")
      loadServices()
    } catch (error: any) {
      console.error("Error saving service:", error)
      toast.error(error.message || "Bir hata oluştu")
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      title: service.title,
      description: service.description,
      image_url: service.image_url,
      icon_name: service.icon_name,
      order_index: service.order_index,
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("services").delete().eq("id", id)
      if (error) throw error
      toast.success("Hizmet silindi")
      loadServices()
    } catch (error: any) {
      console.error("Error deleting service:", error)
      toast.error(error.message || "Silme işlemi başarısız")
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">Hizmetler</h3>
        <AdminDialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) {
              setEditingService(null)
              setFormData({ title: "", description: "", image_url: "", icon_name: "", order_index: 0 })
            }
          }}
          title={editingService ? "Hizmeti Düzenle" : "Yeni Hizmet Ekle"}
          description="Temel hizmet bilgilerini girin"
          onSubmit={handleSubmit}
          submitLabel={editingService ? "Güncelle" : "Ekle"}
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-slate-300">Başlık</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-slate-300">Kısa Açıklama</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <ImageUpload
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              label="Hizmet Görseli (Liste Görseli)"
            />
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <p className="text-sm text-cyan-400">
                💡 <strong>İpucu:</strong> Detaylı bilgileri (deneyim, avantajlar, fotoğraflar) düzenlemek için hizmet kartındaki "Detayları Düzenle" butonunu kullanın.
              </p>
            </div>
            <div>
              <Label htmlFor="icon_name" className="text-slate-300">İkon Adı (örn: shield-check, search)</Label>
              <Input
                id="icon_name"
                value={formData.icon_name}
                onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="shield-check"
              />
            </div>
            <div>
              <Label htmlFor="order_index" className="text-slate-300">Sıra</Label>
              <Input
                id="order_index"
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: Number.parseInt(e.target.value) || 0 })}
                required
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
        </AdminDialog>
        
        <Button
          onClick={() => {
            setEditingService(null)
            setFormData({ title: "", description: "", image_url: "", icon_name: "", order_index: 0 })
            setIsOpen(true)
          }}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Hizmet Ekle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <Card key={service.id} className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex justify-between items-start">
                <span>{service.title}</span>
                <div className="flex gap-2 flex-wrap">
                  <ServiceDetailManager service={service} onUpdate={loadServices} />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(service)}
                    className="text-cyan-400 hover:text-cyan-300"
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
                        <AlertDialogTitle className="text-white">Hizmeti Sil</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                          "{service.title}" hizmetini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
                          İptal
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(service.id)}
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
              {service.image_url && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4 bg-slate-800">
                  <Image
                    src={service.image_url}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <p className="text-slate-400 text-sm mb-2">{service.description}</p>
              <div className="text-xs text-slate-500">
                <p>İkon: {service.icon_name || "Yok"}</p>
                <p>Sıra: {service.order_index}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
