import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Cloudinary + common social CDNs. Add your domains here.
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // NOTE: do not add "framer-motion" here — optimizePackageImports
    // breaks its `motion` proxy export and crashes prerender.
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
