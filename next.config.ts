import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cloudflare Workers n'héberge pas l'optimiseur d'images de Next : on sert
    // les fichiers tels quels (Supabase Storage et le CDN de démo renvoient
    // déjà du WebP compressé).
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.dummyjson.com", pathname: "/**" },
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
