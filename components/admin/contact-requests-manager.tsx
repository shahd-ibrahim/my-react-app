"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Circle, Trash2 } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface ContactRequest {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  status: "new" | "in_progress" | "completed"
  is_read: boolean
  created_at: string
}

export function ContactRequestsManager() {
  const [requests, setRequests] = useState<ContactRequest[]>([])
  const supabase = createClient()

  const loadRequests = async () => {
    const { data } = await supabase.from("contact_requests").select("*").order("created_at", { ascending: false })
    if (data) setRequests(data)
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("contact_requests").update({ status }).eq("id", id)
    loadRequests()
  }

  const markAsRead = async (id: string) => {
    await supabase.from("contact_requests").update({ is_read: true }).eq("id", id)
    loadRequests()
  }

  const markAsUnread = async (id: string) => {
    await supabase.from("contact_requests").update({ is_read: false }).eq("id", id)
    loadRequests()
  }

  const deleteRequest = async (id: string) => {
    try {
      const { error } = await supabase.from("contact_requests").delete().eq("id", id)
      if (error) throw error
      toast.success("Talep silindi")
      loadRequests()
    } catch (error: any) {
      console.error("Error deleting request:", error)
      toast.error(error.message || "Silme işlemi başarısız")
    }
  }

  const unreadCount = requests.filter((r) => !r.is_read).length

  const getStatusBadge = (status: string) => {
    const variants = {
      new: "bg-blue-500",
      in_progress: "bg-cyan-500",
      completed: "bg-green-500",
    }
    const labels = {
      new: "Yeni",
      in_progress: "İşlemde",
      completed: "Tamamlandı",
    }
    return (
      <Badge className={`${variants[status as keyof typeof variants]} text-white`}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold text-white">İletişim Talepleri</h3>
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white">
              {unreadCount} Okunmamış Mesaj
            </Badge>
          )}
        </div>
        <p className="text-slate-400">Toplam {requests.length} talep</p>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <Card 
            key={request.id} 
            className={`bg-slate-900 border-slate-800 transition-all ${
              !request.is_read 
                ? "border-l-4 border-l-cyan-500 bg-slate-900/80 shadow-lg shadow-cyan-500/10" 
                : ""
            }`}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {!request.is_read && (
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                  )}
                  <CardTitle className={`text-lg ${!request.is_read ? "text-white font-bold" : "text-white"}`}>
                    {request.name}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(request.status)}
                  {request.is_read ? (
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Okundu
                    </Badge>
                  ) : (
                    <Badge className="bg-cyan-500 text-white">
                      <Circle className="w-3 h-3 mr-1" />
                      Yeni
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-500">E-posta:</span>
                  <p className="text-white">{request.email}</p>
                </div>
                <div>
                  <span className="text-slate-500">Telefon:</span>
                  <p className="text-white">{request.phone || "Belirtilmemiş"}</p>
                </div>
              </div>
              <div>
                <span className="text-slate-500 text-sm">Mesaj:</span>
                <p className="text-white mt-1">{request.message}</p>
              </div>
              <div className="text-xs text-slate-500">
                {new Date(request.created_at).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="flex gap-2 pt-2 flex-wrap">
                <Select value={request.status} onValueChange={(value) => updateStatus(request.id, value)}>
                  <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="new">Yeni</SelectItem>
                    <SelectItem value="in_progress">İşlemde</SelectItem>
                    <SelectItem value="completed">Tamamlandı</SelectItem>
                  </SelectContent>
                </Select>
                {!request.is_read ? (
                  <Button
                    size="sm"
                    onClick={() => markAsRead(request.id)}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Okundu İşaretle
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markAsUnread(request.id)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    <Circle className="w-4 h-4 mr-1" />
                    Okunmadı İşaretle
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Sil
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-900 border-slate-800">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Talebi Sil</AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-400">
                        "{request.name}" adlı kişinin talebini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
                        İptal
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteRequest(request.id)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Sil
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
