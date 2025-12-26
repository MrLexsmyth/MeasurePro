import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // swcMinify is removed - SWC minification is now the default in Next.js 16
};

// Apply the PWA wrapper
const config = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // Optional: disable PWA in dev
})(nextConfig);

export default config;