/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
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
