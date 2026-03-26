import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Transpile Three.js ecosystem
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
   allowedDevOrigins: ["10.38.214.34"],
  // Enable React strict mode for better development warnings
  reactStrictMode: true,

  // Image optimization — allow SVG and common formats
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },

  // Compiler — remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
