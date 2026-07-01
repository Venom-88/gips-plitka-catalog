/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Фото из Vercel Blob оптимизируются (ресайз + WebP/AVIF) через CDN.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "*.blob.vercel-storage.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
