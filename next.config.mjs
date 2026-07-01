/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Реальные фото из админки/CMS можно отдавать с внешнего хоста — домены добавляются здесь.
    remotePatterns: [],
  },
};

export default nextConfig;
