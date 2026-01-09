"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { AdminDialog } from "./admin-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/ui/image-upload"
import { GalleryImageUpload } from "./gallery-image-upload"
import { Plus, X, Edit } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface ServiceDetail {
  id: string
  title: string
  detail_content: string | null
  detail_image_url: string | null
  experience_years: number | null
  experience_description: string | null
  benefits: string | null
  features: string | null
  gallery_images: string | null
}

interface ServiceDetailManagerProps {
  service: ServiceDetail
  onUpdate: () => void
}

export function ServiceDetailManager({ service, onUpdate }: ServiceDetailManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    detail_content: service.detail_content || "",
    detail_image_url: service.detail_image_url || "",
    experience_years: service.experience_years || 0,
    experience_description: service.experience_description || "",
    benefits: service.benefits || "",
    features: service.features || "",
    gallery_images: service.gallery_images || "[]",
  })

  const galleryImages = (() => {
    try {
      const parsed = JSON.parse(formData.gallery_images || "[]")
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { error } = await supabase
        .from("services")
        .update(formData)
        .eq("id", service.id)

      if (error) throw error

      toast.success("Hizmet detayları güncellendi")
      setIsOpen(false)
      onUpdate()
    } catch (error: any) {
      console.error("Error updating service details:", error)
      toast.error(error.message || "Bir hata oluştu")
    } finally {
      setSaving(false)
    }
  }

  const addGalleryImage = (url: string) => {
    const images = [...galleryImages, url]
    setFormData({ ...formData, gallery_images: JSON.stringify(images) })
  }

  const removeGalleryImage = (index: number) => {
    const images = galleryImages.filter((_, i) => i !== index)
    setFormData({ ...formData, gallery_images: JSON.stringify(images) })
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
      >
        <Edit className="w-4 h-4 mr-2" />
        Detayları Düzenle
      </Button>

      <AdminDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title={`${service.title} - Detay Yönetimi`}
        description="Hizmet detaylarını, deneyimlerinizi ve fotoğraflarınızı yönetin"
        onSubmit={handleSubmit}
        submitLabel="Detayları Kaydet"
        isLoading={saving}
      >
        <div className="space-y-6">
          {/* Deneyim Bölümü */}
          <div className="space-y-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white">Deneyim Bilgileri</h3>
            
            <div>
              <Label htmlFor="experience_years" className="text-slate-300">
                Yıllık Deneyim
              </Label>
              <Input
                id="experience_years"
                type="number"
                value={formData.experience_years}
                onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="10"
              />
              <p className="text-xs text-slate-500 mt-1">Bu hizmette kaç yıllık deneyiminiz var?</p>
            </div>

            <div>
              <Label htmlFor="experience_description" className="text-slate-300">
                Deneyim Açıklaması
              </Label>
              <Textarea
                id="experience_description"
                value={formData.experience_description}
                onChange={(e) => setFormData({ ...formData, experience_description: e.target.value })}
                rows={4}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Örn: 10 yıldan fazla deneyimimizle, 500+ başarılı projeye imza attık..."
              />
              <p className="text-xs text-slate-500 mt-1">Müşterileri ikna edici deneyim bilgilerinizi yazın</p>
            </div>
          </div>

          {/* Avantajlar */}
          <div className="space-y-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white">Avantajlar & Faydalar</h3>
            <div>
              <Label htmlFor="benefits" className="text-slate-300">
                Müşteri Avantajları
              </Label>
              <Textarea
                id="benefits"
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                rows={6}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Her satıra bir avantaj yazın:&#10;✓ 7/24 Destek&#10;✓ Uzman Ekip&#10;✓ Hızlı Çözüm&#10;✓ Garantili Hizmet"
              />
              <p className="text-xs text-slate-500 mt-1">Müşterilerinize sunacağınız avantajları listeleyin</p>
            </div>
          </div>

          {/* Özellikler */}
          <div className="space-y-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white">Hizmet Özellikleri</h3>
            <div>
              <Label htmlFor="features" className="text-slate-300">
                Özellikler
              </Label>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                rows={6}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Her satıra bir özellik yazın:&#10;• Profesyonel Ekip&#10;• Son Teknoloji&#10;• Hızlı Teslimat&#10;• Özel Çözümler"
              />
              <p className="text-xs text-slate-500 mt-1">Hizmetinizin öne çıkan özelliklerini listeleyin</p>
            </div>
          </div>

          {/* Detay Görseli */}
          <div>
            <ImageUpload
              value={formData.detail_image_url}
              onChange={(url) => setFormData({ ...formData, detail_image_url: url })}
              label="Detay Sayfası Ana Görseli"
            />
          </div>

          {/* Detay İçeriği (HTML - Gelişmiş) */}
          <div>
            <Label htmlFor="detail_content" className="text-slate-300">
              Detaylı İçerik (HTML - Opsiyonel)
            </Label>
            <Textarea
              id="detail_content"
              value={formData.detail_content}
              onChange={(e) => setFormData({ ...formData, detail_content: e.target.value })}
              rows={8}
              className="bg-slate-800 border-slate-700 text-white font-mono text-sm"
              placeholder="<p>HTML formatında detaylı içerik yazabilirsiniz...</p>"
            />
            <p className="text-xs text-slate-500 mt-1">HTML bilginiz varsa detaylı içerik ekleyebilirsiniz (opsiyonel)</p>
          </div>

          {/* Galeri */}
          <div className="space-y-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Fotoğraf Galerisi</h3>
              <div className="text-xs text-slate-400">
                {galleryImages.length} fotoğraf
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="relative w-full h-32 rounded-lg overflow-hidden bg-slate-800">
                    <Image
                      src={url}
                      alt={`Galeri ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              
              {/* Add Image Button */}
              <GalleryImageUpload onImageAdded={addGalleryImage} />
            </div>
            <p className="text-xs text-slate-500">Hizmetinizle ilgili fotoğraflar ekleyin</p>
          </div>
        </div>
      </AdminDialog>
    </>
  )
}
