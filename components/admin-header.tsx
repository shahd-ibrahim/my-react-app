"use client"

import { Button } from "@/components/ui/button"
import { Shield, LogOut, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

export function AdminHeader({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const router = useRouter()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            {onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold leading-tight text-sm">GAZİANTEP KRİMİNAL BÜRO</span>
                <span className="text-cyan-400 text-xs font-semibold leading-tight">Admin Paneli</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-slate-300 hover:text-white hover:bg-slate-800/50 border border-slate-800 hover:border-cyan-500/50 transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Çıkış Yap</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
