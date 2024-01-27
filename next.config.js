/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, isServer) => {
    config.resolve.alias.canvas = false;
    if (!isServer) {
      // config.resolve.alias['pdfjs-dist/build/pdf'] = 'pdfjs-dist/build/pdf';
    }
    return config;
  },
};

module.exports = nextConfig;
