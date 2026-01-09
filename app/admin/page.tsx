"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { ServicesManager } from "@/components/admin/services-manager"
import { FeaturesManager } from "@/components/admin/features-manager"
import { ContactRequestsManager } from "@/components/admin/contact-requests-manager"
import { NewsManager } from "@/components/admin/news-manager"
import { CategoriesManager } from "@/components/admin/categories-manager"
import { SiteSettingsManager } from "@/components/admin/site-settings-manager"
import { HeroManager } from "@/components/admin/hero-manager"
import { LogoManager } from "@/components/admin/logo-manager"
import { HeaderFooterManager } from "@/components/admin/header-footer-manager"
import { ProfileManager } from "@/components/admin/profile-manager"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("header-footer")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication on client side
    const checkAuth = async () => {
      const response = await fetch("/api/auth/user")
      if (!response.ok) {
        router.push("/auth/login")
      }
    }
    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative">
      {/* Background decorative elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex pt-20 relative z-10">
        {/* Sidebar */}
        <AdminSidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab)
            // Close sidebar on mobile after selection
            if (window.innerWidth < 1024) {
              setSidebarOpen(false)
            }
          }}
          sidebarOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 min-h-screen transition-all duration-300">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <div className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-4">
                <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">İçerik Yönetimi</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Admin{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Paneli</span>
              </h2>
              <p className="text-slate-400 text-lg">Web sitesi içeriğini buradan yönetebilirsiniz</p>
            </div>

            <div className="space-y-8">
              {/* Anasayfa sırasına göre düzenlendi */}
              <div id="header-footer" className={activeTab === "header-footer" ? "block" : "hidden"}>
                <HeaderFooterManager />
              </div>

              <div id="hero" className={activeTab === "hero" ? "block" : "hidden"}>
                <HeroManager />
              </div>

              <div id="services" className={activeTab === "services" ? "block" : "hidden"}>
                <ServicesManager />
              </div>

              <div id="categories" className={activeTab === "categories" ? "block" : "hidden"}>
                <CategoriesManager />
              </div>

              <div id="features" className={activeTab === "features" ? "block" : "hidden"}>
                <FeaturesManager />
              </div>

              <div id="contacts" className={activeTab === "contacts" ? "block" : "hidden"}>
                <ContactRequestsManager />
              </div>

              <div id="news" className={activeTab === "news" ? "block" : "hidden"}>
                <NewsManager />
              </div>

              <div id="logo" className={activeTab === "logo" ? "block" : "hidden"}>
                <LogoManager />
              </div>

              <div id="site-settings" className={activeTab === "site-settings" ? "block" : "hidden"}>
                <SiteSettingsManager />
              </div>

              <div id="profile" className={activeTab === "profile" ? "block" : "hidden"}>
                <ProfileManager />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
