import nextPWA from "next-pwa"

const withPWA = nextPWA({

  dest: "public",

  register: true,

  skipWaiting: true,

  clientsClaim: true,

  disable:
    process.env.NODE_ENV === "development",

  fallbacks: {

    document: "/offline"
  }
})

const nextConfig = {

  reactStrictMode: true,

  images: {

    unoptimized: true
  },

  experimental: {

    optimizePackageImports: [
      "react-icons"
    ]
  }
}

export default withPWA(nextConfig)
