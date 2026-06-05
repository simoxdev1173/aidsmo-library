import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@napi-rs/canvas'],
  outputFileTracingIncludes: {
    '/*': [
      './node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs',
      './node_modules/@napi-rs/canvas/**/*',
      './node_modules/@napi-rs/canvas-*',
      './node_modules/@napi-rs/canvas-*/**/*',
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '60mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'designsystem.gov.ae',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
