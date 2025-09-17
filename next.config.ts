/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "ui-avatars.com", pathname: "/**" },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      { protocol: "https", hostname: "logo.clearbit.com", pathname: "/**" },
      { protocol: "https", hostname: "avatar.iran.liara.run", pathname: "/**" },
      { protocol: "https", hostname: "images.pexels.com", pathname: "/**" },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during build
  },
  env: {
    API_URL: process.env.API_URL || "http://localhost:8080", // Default to local API URL if not set
    CHAT_URL: process.env.CHAT_URL || "http://localhost:8000/chat", // Default to local CHAT URL if not set
  },
};

export default nextConfig;
