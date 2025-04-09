
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: process.env.NEXT_PUBLIC_STRAPI_URL?.split(':')[0] ?? 'http',
        hostname: new URL(process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337').hostname,
        port: new URL(process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337').port || '',
        pathname: '/**/*',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
};

export default nextConfig;
