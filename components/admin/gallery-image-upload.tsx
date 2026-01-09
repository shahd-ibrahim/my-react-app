"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Image as ImageIcon } from "lucide-react"

interface GalleryImageUploadProps {
  onImageAdded: (url: string) => void
}

export function GalleryImageUpload({ onImageAdded }: GalleryImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }

      const { url } = await response.json()
      onImageAdded(url)
    } catch (error: any) {
      console.error("Upload error:", error)
      alert(error.message || "Fotoğraf yüklenirken bir hata oluştu")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      className="relative w-full h-32 rounded-lg border-2 border-dashed border-slate-700 bg-slate-800/50 flex items-center justify-center cursor-pointer hover:border-cyan-500 transition-colors"
    >
      <div className="text-center">
        <ImageIcon className="w-8 h-8 mx-auto text-slate-500 mb-2" />
        <p className="text-xs text-slate-400">Fotoğraf Ekle</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
        className="hidden"
      />
      {uploading && (
        <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
