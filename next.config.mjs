import nextPWA from "next-pwa"

const withPWA = nextPWA({

  dest: "public",

  register: true,

  skipWaiting: true,
  dynamicStartUrl:true,
  
  cacheOnFrontEndNav: false,

  reloadOnOnline: true,

  disable:
    process.env.NODE_ENV ===
    "development",

  buildExcludes: [
    /middleware-manifest\.json$/
  ],
})

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

export default withPWA(
  nextConfig
)