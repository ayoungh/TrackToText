/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    OPEN_API_KEY: process.env.OPEN_API_KEY,
  },
  // Will be available on both server and client
  publicRuntimeConfig: {
    NEXT_PUBLIC_OPEN_API_KEY: process.env.NEXT_PUBLIC_OPEN_API_KEY,
  },
};

module.exports = nextConfig
