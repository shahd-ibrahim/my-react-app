"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/ui/image-upload"
import Image from "next/image"
import { toast } from "sonner"

interface Category {
  id: string
  name: string
  description: string | null
  icon_name: string | null
  image_url: string | null
  order_index: number
}

export function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    order_index: 0,
  })
  const supabase = createClient()

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    const { data } = await supabase.from("categories").select("*").order("order_index")
    if (data) setCategories(data)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (editingCategory) {
        const { error } = await supabase.from("categories").update(formData).eq("id", editingCategory.id)
        if (error) throw error
        toast.success("Kategori güncellendi")
      } else {
        const { error } = await supabase.from("categories").insert(formData)
        if (error) throw error
        toast.success("Kategori eklendi")
      }
      setIsOpen(false)
      setEditingCategory(null)
      setFormData({ name: "", description: "", image_url: "", order_index: 0 })
      loadCategories()
    } catch (error: any) {
      console.error("Error saving category:", error)
      toast.error(error.message || "Bir hata oluştu")
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id)
      if (error) throw error
      toast.success("Kategori silindi")
      loadCategories()
    } catch (error: any) {
      console.error("Error deleting category:", error)
      toast.error(error.message || "Silme işlemi başarısız")
    }
  }

  function handleEdit(category: Category) {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
      image_url: category.image_url || "",
      order_index: category.order_index,
    })
    setIsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">Kategoriler</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingCategory(null)
                setFormData({ name: "", description: "", image_url: "", order_index: 0 })
              }}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Kategori Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">{editingCategory ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-slate-300">
                  Kategori Adı
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-slate-300">
                  Açıklama
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  label="Kategori Fotoğrafı"
                />
              </div>
              <div>
                <Label htmlFor="order_index" className="text-slate-300">
                  Sıra
                </Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: Number.parseInt(e.target.value) || 0 })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                  {editingCategory ? "Güncelle" : "Ekle"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false)
                    setEditingCategory(null)
                    setFormData({ name: "", description: "", image_url: "", order_index: 0 })
                  }}
                  className="border-slate-700 text-slate-300"
                >
                  İptal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {categories.map((item) => (
          <Card key={item.id} className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                {item.image_url && (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{item.name}</h3>
                  {item.description && <p className="text-slate-400 text-sm mb-2">{item.description}</p>}
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded">Sıra: {item.order_index}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(item)}
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
                        <AlertDialogTitle className="text-white">Kategoriyi Sil</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                          "{item.name}" kategorisini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
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
