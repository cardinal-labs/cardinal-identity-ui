module.exports = {
  reactStrictMode: false,
  env: {
    MAINNET_PRIMARY: process.env.MAINNET_PRIMARY,
    BASE_CLUSTER: process.env.BASE_CLUSTER,
  },
  webpack: (config) => {
    // Unset client-side javascript that only works server-side
    config.resolve.fallback = { fs: false, module: false, path: false }
    return config
  },
}
