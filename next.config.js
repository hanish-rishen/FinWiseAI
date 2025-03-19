/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Change this from a boolean to an object if it's just `true`
    serverActions: {
      // Add specific options here if needed
      allowedOrigins: ["*"],
      bodySizeLimit: "2mb",
    },
  },
  images: {
    domains: ["localhost", "pmtyykmezebdzaaumbhp.supabase.co"],
  },
  webpack: (config, { isServer }) => {
    // Fix face-api.js issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        encoding: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
