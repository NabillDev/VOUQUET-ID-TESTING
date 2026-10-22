/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    outputFileTracingIncludes: {
      "/**": ["./prisma/seed.sqlite"],
    },
  },
  async rewrites() {
    return [
      {
        source: "/_styleguide",
        destination: "/styleguide",
      },
    ];
  },
};

export default nextConfig;
