/**
 * Task: T010
 * Spec: 002-authentication - Next.js Configuration
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // Enable standalone output for Docker
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
          : 'http://localhost:8000/api/v1/:path*',
      },
    ]
  },
  // Skip static generation for pages with dynamic authentication
  experimental: {
    isrMemoryCacheSize: 0,
  },
}

module.exports = nextConfig
