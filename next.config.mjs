import nextPWA from "next-pwa"

const withPWA = nextPWA({

  dest: "public",

  register: true,

  skipWaiting: true,

  cacheOnFrontEndNav: true,

  reloadOnOnline: true,

  disable:
    process.env.NODE_ENV ===
    "development",

  buildExcludes: [
    /middleware-manifest\.json$/
  ],

  runtimeCaching: [

    {

      urlPattern: /^https?.*/,

      handler: "NetworkFirst",

      options: {

        cacheName:
          "offlineCache",

        networkTimeoutSeconds: 10,

        expiration: {

          maxEntries: 200,

          maxAgeSeconds:
            7 * 24 * 60 * 60
        },

        cacheableResponse: {

          statuses: [0, 200]
        }
      }
    }
  ]
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