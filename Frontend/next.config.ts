import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      // NUEVO: Permiso para tu servidor de MinIO
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/proconecta-uploads/**',
      },
    ],
  },
};

export default nextConfig;
