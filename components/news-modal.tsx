"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Calendar, Tag } from "lucide-react"
import Image from "next/image"

interface NewsItem {
  id: string
  title: string
  content: string
  image_url: string | null
  category: string | null
  published_at: string
}

interface NewsModalProps {
  news: NewsItem[]
}

export function NewsModal({ news }: NewsModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Show modal on first visit
    const hasVisited = sessionStorage.getItem("hasVisitedSite")
    if (!hasVisited && news.length > 0) {
      setIsOpen(true)
      sessionStorage.setItem("hasVisitedSite", "true")
    }
  }, [news.length])

  const currentNews = news[currentIndex]

  if (!currentNews) return null

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % news.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-950 border-cyan-500/30">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="inline-block px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 rounded-full">
              <span className="text-cyan-400 font-semibold text-xs uppercase tracking-wider">Haberler</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          {currentNews.image_url && (
            <div className="relative w-full h-64 rounded-xl overflow-hidden">
              <Image
                src={currentNews.image_url || "/placeholder.svg"}
                alt={currentNews.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-slate-400">
            {currentNews.category && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-cyan-400" />
                <span>{currentNews.category}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>{new Date(currentNews.published_at).toLocaleDateString("tr-TR")}</span>
            </div>
          </div>

          {/* Title */}
          <DialogTitle className="text-3xl font-bold text-white text-balance">{currentNews.title}</DialogTitle>

          {/* Content */}
          <div className="text-slate-300 leading-relaxed text-balance whitespace-pre-line">{currentNews.content}</div>

          {/* Navigation */}
          {news.length > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
              <Button
                onClick={handlePrev}
                variant="outline"
                className="border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-400 bg-transparent"
              >
                ← Önceki
              </Button>

              <div className="flex gap-2">
                {news.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex ? "bg-cyan-400 w-6" : "bg-slate-600 hover:bg-slate-500"
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNext}
                variant="outline"
                className="border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-400 bg-transparent"
              >
                Sonraki →
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
