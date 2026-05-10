import nextPWA from 'next-pwa'

const withPWA = nextPWA({
  dest: 'public',

  register: true,
  skipWaiting: true,

  disable: process.env.NODE_ENV === 'development'
})

/** @type {import('next').NextConfig} */
const nextConfig = {

  reactStrictMode: true,

  experimental: {
    optimizePackageImports: [
      "react-icons"
    ]
  },

  images: {
    unoptimized: true
  }
}

export default withPWA(nextConfig)