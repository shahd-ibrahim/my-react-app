"use client"

import { Phone, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function FloatingButtons() {
  return (
    <>
      {/* Hemen Ara Button - Top Right */}
      <Link
        href="tel:+903421234567"
        className="fixed bottom-32 right-6 z-50 group"
      >
        <Button
          size="lg"
          className="rounded-full w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-300 hover:scale-110 animate-pulse"
        >
          <Phone className="w-6 h-6" />
        </Button>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping" />
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full" />
      </Link>

      {/* WhatsApp Button - Bottom Right with Wave Animation */}
      <Link
        href="https://wa.me/903421234567"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="relative">
          {/* Wave Animation */}
          <div className="absolute inset-0 rounded-full bg-green-500/30 animate-ping" />
          <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" style={{ animationDelay: "0.5s" }} />
          <div className="absolute inset-0 rounded-full bg-green-500/10 animate-ping" style={{ animationDelay: "1s" }} />
          
          <Button
            size="lg"
            className="relative rounded-full w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-2xl shadow-green-500/50 hover:shadow-green-500/70 transition-all duration-300 hover:scale-110"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </div>
      </Link>
    </>
  )
}
