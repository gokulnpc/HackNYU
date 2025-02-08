/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { encoding: false };
    return config;
  },
};

module.exports = nextConfig;
