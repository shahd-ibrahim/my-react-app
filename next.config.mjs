/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Source map ayarları - production'da devre dışı
  productionBrowserSourceMaps: false,
  // Turbopack için boş config (Next.js 16 varsayılanı)
  turbopack: {},
}

export default nextConfig
