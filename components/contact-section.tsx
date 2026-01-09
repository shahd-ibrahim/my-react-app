"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"

const slideshowImages = [
  "/images/siber-guvenlik-1.jpg",
  "/images/images2.jpg",
  "/images/adli-bilisim.jpg",
  "/images/hard-drive.jpg",
]

export function ContactSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [sectionTexts, setSectionTexts] = useState({
    badge: "İletişim",
    titlePart1: "Bizimle",
    titlePart2: "İletişime Geçin",
    description: "Hemen bizimle iletişime geçin ve güvenlik ihtiyaçlarınızı paylaşın!",
    phoneLabel: "Telefon",
    phone: "+90 342 123 45 67",
    emailLabel: "E-posta",
    email: "info@gaziantepkriminalburo.com",
    addressLabel: "Adres",
    address: "Gaziantep, Türkiye",
    buttonText: "Teklif Alın",
    formButton: "Mesaj Gönder",
  })

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const supabase = createClient()

  // Load section texts
  useEffect(() => {
    const loadTexts = async () => {
      try {
        const keys = [
          "contact_badge",
          "contact_title_part1",
          "contact_title_part2",
          "contact_description",
          "contact_phone_label",
          "contact_phone",
          "contact_email_label",
          "contact_email",
          "contact_address_label",
          "contact_address",
          "contact_button_text",
          "contact_form_button",
        ]

        const { data } = await supabase
          .from("site_settings")
          .select("setting_key, setting_value")
          .in("setting_key", keys)

        if (data) {
          const texts: any = {}
          data.forEach((item) => {
            const key = item.setting_key.replace("contact_", "")
            if (key === "badge") texts.badge = item.setting_value || "İletişim"
            else if (key === "title_part1") texts.titlePart1 = item.setting_value || "Bizimle"
            else if (key === "title_part2") texts.titlePart2 = item.setting_value || "İletişime Geçin"
            else if (key === "description") texts.description = item.setting_value || "Hemen bizimle iletişime geçin..."
            else if (key === "phone_label") texts.phoneLabel = item.setting_value || "Telefon"
            else if (key === "phone") texts.phone = item.setting_value || "+90 342 123 45 67"
            else if (key === "email_label") texts.emailLabel = item.setting_value || "E-posta"
            else if (key === "email") texts.email = item.setting_value || "info@example.com"
            else if (key === "address_label") texts.addressLabel = item.setting_value || "Adres"
            else if (key === "address") texts.address = item.setting_value || "Gaziantep, Türkiye"
            else if (key === "button_text") texts.buttonText = item.setting_value || "Teklif Alın"
            else if (key === "form_button") texts.formButton = item.setting_value || "Mesaj Gönder"
          })
          setSectionTexts((prev) => ({ ...prev, ...texts }))
        }
      } catch (error) {
        console.error("Error loading contact texts:", error)
      }
    }
    loadTexts()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % slideshowImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus({ type: null, message: "" })

    try {
      const { error } = await supabase.from("contact_requests").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      })

      if (error) throw error

      setStatus({
        type: "success",
        message: "Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.",
      })
      setFormData({ name: "", email: "", phone: "", message: "" })
    } catch (error) {
      setStatus({
        type: "error",
        message: "Bir hata oluştu. Lütfen tekrar deneyin.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section
      id="iletisim"
      className="py-24 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950 relative overflow-hidden"
    >
      <div className="absolute inset-0">
        {slideshowImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-30" : "opacity-0"
            }`}
          >
            <Image src={image || "/placeholder.svg"} alt={`Background ${index + 1}`} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/85 to-slate-950/90" />
          </div>
        ))}
      </div>

      {/* Slideshow Indicators */}
      <div className="absolute top-8 right-8 z-20 flex gap-2">
        {slideshowImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex ? "bg-cyan-500 w-8" : "bg-slate-600 hover:bg-slate-500"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-4">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">{sectionTexts.badge}</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 text-balance">
            {sectionTexts.titlePart1}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {sectionTexts.titlePart2}
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto text-balance">{sectionTexts.description}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {sectionTexts.phoneLabel}
                  </h3>
                  <p className="text-slate-300 text-lg">{sectionTexts.phone}</p>
                </div>
              </div>
            </div>

            <div className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {sectionTexts.emailLabel}
                  </h3>
                  <p className="text-slate-300 text-lg break-all">{sectionTexts.email}</p>
                </div>
              </div>
            </div>

            <div className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {sectionTexts.addressLabel}
                  </h3>
                  <p className="text-slate-300 text-lg">{sectionTexts.address}</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-lg h-14 px-8 w-full rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
              >
                {sectionTexts.buttonText} →
              </Button>
            </div>
          </div>

          <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700/50">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl" />

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <Label htmlFor="name" className="text-white mb-2 font-semibold">
                  Ad Soyad
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-slate-900/50 border-slate-600 text-white focus:border-cyan-500 focus:ring-cyan-500/20 h-12 rounded-xl"
                  placeholder="Adınız ve soyadınız"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-white mb-2 font-semibold">
                  E-posta
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-slate-900/50 border-slate-600 text-white focus:border-cyan-500 focus:ring-cyan-500/20 h-12 rounded-xl"
                  placeholder="ornek@email.com"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-white mb-2 font-semibold">
                  Telefon
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-slate-900/50 border-slate-600 text-white focus:border-cyan-500 focus:ring-cyan-500/20 h-12 rounded-xl"
                  placeholder="+90 5XX XXX XX XX"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-white mb-2 font-semibold">
                  Mesajınız
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={4}
                  className="bg-slate-900/50 border-slate-600 text-white focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl resize-none"
                  placeholder="Mesajınızı buraya yazın..."
                />
              </div>

              {status.message && (
                <div
                  className={`p-4 rounded-xl ${
                    status.type === "success"
                      ? "bg-green-500/20 text-green-400 border border-green-500/50"
                      : "bg-red-500/20 text-red-400 border border-red-500/50"
                  }`}
                >
                  {status.message}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-lg h-14 rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Gönderiliyor..." : sectionTexts.formButton}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
