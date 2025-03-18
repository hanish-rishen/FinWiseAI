/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for json-loader error
    config.module.rules.push({
      test: /\.json$/,
      type: "json",
    });

    return config;
  },
  // Keep any existing Next.js config options below
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
