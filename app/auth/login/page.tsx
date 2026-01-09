"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Shield, Lock, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Veritabanı bağlantı hatası için özel mesaj
        if (data.code === "DB_CONNECTION_ERROR") {
          throw new Error("Veritabanı bağlantısı başarısız. Lütfen XAMPP Control Panel'den MySQL servisini başlatın.")
        }
        // Tablo bulunamadı hatası için özel mesaj
        if (data.code === "DB_TABLE_ERROR") {
          throw new Error("Veritabanı tabloları bulunamadı. Lütfen SQL scriptlerini çalıştırdığınızdan emin olun.")
        }
        throw new Error(data.error || "Giriş başarısız")
      }

      if (!data.user) {
        throw new Error("Bu hesap admin yetkisine sahip değil")
      }

      router.push("/admin")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-950/60" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-9 h-9 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold leading-tight text-lg">GAZİANTEP KRİMİNAL BÜRO</span>
                <span className="text-cyan-400 text-xs font-semibold leading-tight">Siber & Güvenlik Teknolojileri</span>
              </div>
            </Link>
            <div className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-2">
              <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Admin Paneli</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Giriş{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Yap</span>
            </h1>
            <p className="text-slate-400 text-center max-w-sm">
              Admin hesabınızla giriş yaparak içerik yönetim paneline erişebilirsiniz
            </p>
          </div>

          {/* Login Card */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-2xl">
            
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    E-posta Adresi
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@gaziantepkriminalburo.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-900/50 border-slate-600 text-white focus:border-cyan-500 focus:ring-cyan-500/20 h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white font-semibold flex items-center gap-2">
                    <Lock className="w-4 h-4 text-cyan-400" />
                    Şifre
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-900/50 border-slate-600 text-white focus:border-cyan-500 focus:ring-cyan-500/20 h-12 rounded-xl"
                  />
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-500/20 text-red-400 border border-red-500/50 text-sm flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-400 text-xs">!</span>
                    </div>
                    <div>{error}</div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-lg h-14 rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Giriş yapılıyor...
                    </span>
                  ) : (
                    "Giriş Yap"
                  )}
                </Button>

                <div className="text-center pt-4">
                  <Link
                    href="/"
                    className="text-slate-400 hover:text-cyan-400 text-sm transition-colors inline-flex items-center gap-1"
                  >
                    ← Anasayfaya Dön
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <div className="mt-6 p-4 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl">
            <p className="text-slate-400 text-xs text-center">
              <span className="text-cyan-400 font-semibold">Not:</span> İlk kez giriş yapıyorsanız, admin kullanıcısı
              oluşturmanız gerekebilir.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
