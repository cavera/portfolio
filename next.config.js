/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  // Every page lives under /[lang]. These send the bare paths to the default
  // locale. Kept as redirects rather than middleware so the site stays fully
  // static — no edge function needed just to add a prefix.
  async redirects() {
    return [
      { source: '/', destination: '/en', permanent: false },
      { source: '/work', destination: '/en/work', permanent: false },
      { source: '/photography', destination: '/en/photography', permanent: false },
      { source: '/about', destination: '/en/about', permanent: false },
    ]
  },
}

module.exports = nextConfig
