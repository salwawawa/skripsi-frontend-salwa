/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['sentratamansari.com'], // Add your backend hostname here
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
