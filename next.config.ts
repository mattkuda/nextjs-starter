import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'pbs.twimg.com' },
      { protocol: 'https', hostname: 'abs.twimg.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // eslint: {
  //   ignoreDuringBuilds: true, // This prevents ESLint errors from blocking builds
  // },
  // typescript: {
  //   ignoreBuildErrors: true, // Ignores TypeScript errors during build
  // },
};

export default nextConfig;
