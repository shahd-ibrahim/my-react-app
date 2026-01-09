import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2, Star } from "lucide-react"
import Link from "next/link"

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: service } = await supabase.from("services").select("*").eq("id", id).single()

  if (!service) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />
      
      <div className="pt-20 pb-24">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Back Button */}
          <Link href="/#hizmetler">
            <Button
              variant="ghost"
              className="mb-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Hizmetlere Dön
            </Button>
          </Link>

          {/* Service Header */}
          <div className="mb-12">
            <div className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6">
              <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Hizmet Detayı</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {service.title}
            </h1>
            <p className="text-xl text-slate-400">{service.description}</p>
          </div>

          {/* Service Image */}
          {service.detail_image_url || service.image_url ? (
            <div className="relative w-full h-96 rounded-2xl overflow-hidden mb-12">
              <Image
                src={service.detail_image_url || service.image_url}
                alt={service.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
            </div>
          ) : null}

          {/* Experience Section */}
          {service.experience_years && service.experience_years > 0 && (
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8 mb-12">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{service.experience_years}+</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">Yıllık Deneyim</h3>
                  {service.experience_description && (
                    <p className="text-slate-300 leading-relaxed">{service.experience_description}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Benefits Section */}
          {service.benefits && (
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-white mb-6">Avantajlarımız</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {service.benefits.split('\n').filter(line => line.trim()).map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-300">{benefit.replace(/^[✓•]\s*/, '')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features Section */}
          {service.features && (
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-white mb-6">Hizmet Özellikleri</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {service.features.split('\n').filter(line => line.trim()).map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                    <Star className="w-5 h-5 text-cyan-400 fill-cyan-400 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-300">{feature.replace(/^[•-]\s*/, '')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Section */}
          {service.gallery_images && (() => {
            try {
              const gallery = JSON.parse(service.gallery_images)
              if (Array.isArray(gallery) && gallery.length > 0) {
                return (
                  <div className="mb-12">
                    <h3 className="text-3xl font-bold text-white mb-6">Fotoğraf Galerisi</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {gallery.map((imageUrl: string, index: number) => (
                        <div key={index} className="relative aspect-video rounded-xl overflow-hidden bg-slate-800">
                          <Image
                            src={imageUrl}
                            alt={`${service.title} - Fotoğraf ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }
            } catch {
              return null
            }
            return null
          })()}

          {/* Detail Content (HTML) */}
          {service.detail_content && (
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-white mb-6">Detaylı Bilgiler</h3>
              <div 
                className="prose prose-invert prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: service.detail_content }}
              />
            </div>
          )}

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Bu Hizmetimizle İlgileniyor musunuz?</h2>
            <p className="text-slate-400 mb-6">Bizimle iletişime geçin ve detaylı bilgi alın</p>
            <Button
              asChild
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold"
            >
              <Link href="/#iletisim">İletişime Geç</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
