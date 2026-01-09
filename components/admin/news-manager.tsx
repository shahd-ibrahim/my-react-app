"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Star } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "@/components/ui/image-upload"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { AdminDialog } from "./admin-dialog"
import Image from "next/image"
import { toast } from "sonner"

interface News {
  id: string
  title: string
  content: string
  image_url: string | null
  category: string | null
  is_featured: boolean
  published_at: string
}

export function NewsManager() {
  const [news, setNews] = useState<News[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
    category: "",
    is_featured: false,
  })
  const supabase = createBrowserClient()

  useEffect(() => {
    loadNews()
  }, [])

  async function loadNews() {
    try {
      const result = await supabase.from("news").select("*").order("published_at", { ascending: false })
      if (result.data) setNews(result.data)
      if (result.error) console.error("Error loading news:", result.error)
    } catch (error: any) {
      console.error("Error loading news:", error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (editingNews) {
        const { error } = await supabase.from("news").update(formData).eq("id", editingNews.id)
        if (error) throw error
        toast.success("Haber güncellendi")
      } else {
        const { error } = await supabase.from("news").insert(formData)
        if (error) throw error
        toast.success("Haber eklendi")
      }
      setIsOpen(false)
      setEditingNews(null)
      setFormData({ title: "", content: "", image_url: "", category: "", is_featured: false })
      loadNews()
    } catch (error: any) {
      console.error("Error saving news:", error)
      toast.error(error.message || "Bir hata oluştu")
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase.from("news").delete().eq("id", id)
      if (error) throw error
      toast.success("Haber silindi")
      loadNews()
    } catch (error: any) {
      console.error("Error deleting news:", error)
      toast.error(error.message || "Silme işlemi başarısız")
    }
  }

  function handleEdit(item: News) {
    setEditingNews(item)
    setFormData({
      title: item.title,
      content: item.content,
      image_url: item.image_url || "",
      category: item.category || "",
      is_featured: item.is_featured,
    })
    setIsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">Haberler</h3>
        <AdminDialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) {
              setEditingNews(null)
              setFormData({ title: "", content: "", image_url: "", category: "", is_featured: false })
            }
          }}
          title={editingNews ? "Haberi Düzenle" : "Yeni Haber Ekle"}
          description="Haber bilgilerini girin"
          onSubmit={handleSubmit}
          submitLabel={editingNews ? "Güncelle" : "Ekle"}
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-slate-300">
                Başlık
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="content" className="text-slate-300">
                İçerik
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={6}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <ImageUpload
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              label="Haber Görseli"
            />
            <div>
              <Label htmlFor="category" className="text-slate-300">
                Kategori
              </Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Siber Güvenlik"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
              <Label htmlFor="is_featured" className="text-slate-300">
                Öne Çıkan Haber
              </Label>
            </div>
          </div>
        </AdminDialog>
        
        <Button
          onClick={() => {
            setEditingNews(null)
            setFormData({ title: "", content: "", image_url: "", category: "", is_featured: false })
            setIsOpen(true)
          }}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Haber Ekle
        </Button>
      </div>

      <div className="grid gap-4">
        {news.map((item) => (
          <Card key={item.id} className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {item.image_url && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4 bg-slate-800">
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    {item.is_featured && <Star className="w-4 h-4 text-cyan-400 fill-cyan-400" />}
                  </div>
                  <p className="text-slate-400 text-sm mb-2">{item.content}</p>
                  {item.category && (
                    <span className="inline-block px-2 py-1 text-xs bg-cyan-500/10 text-cyan-400 rounded">
                      {item.category}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(item)}
                    className="text-slate-400 hover:text-white"
                  >
                    <Pencil className="w-4 h-4" />
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
                        <AlertDialogTitle className="text-white">Haberi Sil</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                          "{item.title}" haberini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
                          İptal
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(item.id)}
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
