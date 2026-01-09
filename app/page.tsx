import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { CategoriesSection } from "@/components/categories-section"
import { FeaturesSection } from "@/components/features-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { NewsModal } from "@/components/news-modal"
import { FloatingButtons } from "@/components/floating-buttons"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createClient()

  let featuredNews = null
  try {
    const { data } = await supabase
      .from("news")
      .select("*")
      .eq("is_featured", true)
      .order("published_at", { ascending: false })
      .limit(5)
    featuredNews = data
  } catch (error) {
    console.log("[v0] News table not found - run SQL script 003_add_news_and_categories.sql")
  }

  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      <CategoriesSection />
      <FeaturesSection />
      <ContactSection />
      <Footer />
      <FloatingButtons />
      {featuredNews && featuredNews.length > 0 && <NewsModal news={featuredNews} />}
    </main>
  )
}
