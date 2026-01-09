"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { 
  LayoutDashboard, 
  Briefcase, 
  Star, 
  Newspaper, 
  FolderTree, 
  Mail, 
  Settings, 
  Image as ImageIcon,
  FileText,
  Home,
  User
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
}

// Anasayfa sırasına göre düzenlendi: Header, Hero, Services, Categories, Features, Contact, Footer
const navItems: NavItem[] = [
  { id: "header-footer", label: "Header & Footer", icon: LayoutDashboard, href: "#header-footer" },
  { id: "hero", label: "Hero Bölümü", icon: ImageIcon, href: "#hero" },
  { id: "services", label: "Hizmetler", icon: Briefcase, href: "#services" },
  { id: "categories", label: "Kategoriler", icon: FolderTree, href: "#categories" },
  { id: "features", label: "Özellikler", icon: Star, href: "#features" },
  { id: "contacts", label: "İletişim Talepleri", icon: Mail, href: "#contacts" },
  { id: "news", label: "Haberler", icon: Newspaper, href: "#news" },
  { id: "logo", label: "Logolar", icon: FileText, href: "#logo" },
  { id: "site-settings", label: "Site Ayarları", icon: Settings, href: "#site-settings" },
  { id: "profile", label: "Profil Ayarları", icon: User, href: "#profile" },
]

export function AdminSidebar({ 
  activeTab, 
  setActiveTab,
  sidebarOpen = true,
  onClose
}: { 
  activeTab: string
  setActiveTab: (tab: string) => void
  sidebarOpen?: boolean
  onClose?: () => void
}) {
  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      
      <aside className={cn(
        "w-64 bg-slate-900/50 backdrop-blur-sm border-r border-slate-800/50 h-[calc(100vh-5rem)] fixed left-0 top-20 overflow-y-auto z-50 transition-transform duration-300",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-4 space-y-2">
          <div className="mb-6 px-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Menü</h2>
          </div>
          
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  // Scroll to section
                  setTimeout(() => {
                    const element = document.getElementById(item.id)
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                  }, 100)
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group",
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                    : "text-slate-300 hover:bg-slate-800/50 hover:text-cyan-400"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-cyan-400"
                )} />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}

          <div className="pt-6 mt-6 border-t border-slate-800">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800/50 hover:text-cyan-400 transition-all duration-200 group"
            >
              <Home className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              <span className="font-medium">Anasayfaya Dön</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
