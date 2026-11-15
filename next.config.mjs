/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxSize: 20 * 1024 * 1024, // 20MB max chunk size
        minSize: 10 * 1024 * 1024, // 10MB min chunk size
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            maxSize: 20 * 1024 * 1024,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)[\\/]/);
              return packageName ? `npm.${packageName[1].replace('@', '')}` : 'npm.unknown';
            },
            maxSize: 20 * 1024 * 1024,
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;