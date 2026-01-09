"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { User, Mail, Lock, Save, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { AdminDialog } from "./admin-dialog"

export function ProfileManager() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  
  const [emailFormData, setEmailFormData] = useState({
    email: "",
  })
  
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const supabase = createClient()

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const response = await fetch("/api/auth/user")
      if (response.ok) {
        const data = await response.json()
        setUser(data)
        setEmailFormData({ email: data.email || "" })
      }
    } catch (error) {
      console.error("Error loading user:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const response = await fetch("/api/auth/update-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailFormData.email }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "E-posta güncellenemedi")
      }

      toast.success("E-posta başarıyla güncellendi")
      setEmailDialogOpen(false)
      loadUser()
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu")
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      toast.error("Yeni şifreler eşleşmiyor")
      return
    }

    if (passwordFormData.newPassword.length < 6) {
      toast.error("Şifre en az 6 karakter olmalıdır")
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordFormData.currentPassword,
          newPassword: passwordFormData.newPassword,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Şifre güncellenemedi")
      }

      toast.success("Şifre başarıyla güncellendi")
      setPasswordDialogOpen(false)
      setPasswordFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Kullanıcı Bilgileri
          </CardTitle>
          <CardDescription className="text-slate-400">
            Profil bilgilerinizi ve şifrenizi buradan yönetebilirsiniz
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Ad Soyad</Label>
            <div className="text-white font-medium">{user?.full_name || "Belirtilmemiş"}</div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">E-posta</Label>
            <div className="flex items-center gap-2">
              <div className="text-white font-medium flex-1">{user?.email || "Belirtilmemiş"}</div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEmailDialogOpen(true)}
                className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
              >
                <Mail className="w-4 h-4 mr-2" />
                Değiştir
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPasswordDialogOpen(true)}
              className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
            >
              <Lock className="w-4 h-4 mr-2" />
              Şifre Değiştir
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Email Update Dialog */}
      <AdminDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        title="E-posta Değiştir"
        description="Yeni e-posta adresinizi girin"
        onSubmit={handleEmailUpdate}
        submitLabel="E-postayı Güncelle"
        isLoading={saving}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-slate-300">
              Yeni E-posta
            </Label>
            <Input
              id="email"
              type="email"
              value={emailFormData.email}
              onChange={(e) => setEmailFormData({ email: e.target.value })}
              required
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="ornek@email.com"
            />
          </div>
        </div>
      </AdminDialog>

      {/* Password Update Dialog */}
      <AdminDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        title="Şifre Değiştir"
        description="Mevcut şifrenizi ve yeni şifrenizi girin"
        onSubmit={handlePasswordUpdate}
        submitLabel="Şifreyi Güncelle"
        isLoading={saving}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentPassword" className="text-slate-300">
              Mevcut Şifre
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwordFormData.currentPassword}
              onChange={(e) => setPasswordFormData({ ...passwordFormData, currentPassword: e.target.value })}
              required
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div>
            <Label htmlFor="newPassword" className="text-slate-300">
              Yeni Şifre
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={passwordFormData.newPassword}
              onChange={(e) => setPasswordFormData({ ...passwordFormData, newPassword: e.target.value })}
              required
              minLength={6}
              className="bg-slate-800 border-slate-700 text-white"
            />
            <p className="text-xs text-slate-500 mt-1">En az 6 karakter olmalıdır</p>
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="text-slate-300">
              Yeni Şifre (Tekrar)
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordFormData.confirmPassword}
              onChange={(e) => setPasswordFormData({ ...passwordFormData, confirmPassword: e.target.value })}
              required
              minLength={6}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
        </div>
      </AdminDialog>
    </div>
  )
}
