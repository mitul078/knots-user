/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: ['./src'],
  },
  images: {
    domains: ['knots-backend-1.onrender.com'],
  },
  serverExternalPackages: ['axios'],
};

export default nextConfig;
