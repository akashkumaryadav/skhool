/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "ui-avatars.com", pathname: "/**" },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during build
  },
  env: {
    API_URL: process.env.API_URL || "http://localhost:8080", // Default to local API URL if not set
  },
};

export default nextConfig;
