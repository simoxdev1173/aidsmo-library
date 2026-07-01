import type { NextConfig, SizeLimit } from "next";

const serverActionBodySizeLimit = (process.env.SERVER_ACTION_BODY_SIZE_LIMIT ?? '512mb') as SizeLimit;

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
      bodySizeLimit: serverActionBodySizeLimit,
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
      {
        protocol: 'https',
        hostname: 'api-library.arabpfm.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
