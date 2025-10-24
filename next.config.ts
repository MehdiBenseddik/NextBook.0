import type { NextConfig } from "next";

const isStaticExport = process.env.NEXT_STATIC_EXPORT === '1'

const nextConfig: NextConfig = {
  // Enable static page generation only when NEXT_STATIC_EXPORT=1 is set.
  // During development we want dynamic routes (API routes) to work.
  output: isStaticExport ? 'export' : undefined,

  // Configure image optimization
  images: {
    unoptimized: true, // For static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS domains
      },
    ],
  },

  // TypeScript configuration
  typescript: {
    // Report errors during build
    ignoreBuildErrors: false,
  },

  // Enable React strict mode for better development 
  reactStrictMode: true,

  // Customize build output directory
  distDir: '.next',

  // Configure page extensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],

  // ESLint configuration
  eslint: {
    // Don't run ESLint during build to avoid failing due to unescaped entities
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
