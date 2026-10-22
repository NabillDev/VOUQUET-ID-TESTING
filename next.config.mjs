/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    DATABASE_URL: process.env.DATABASE_URL || "file:./dev.db",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "adminpassword123",
    SESSION_SECRET:
      process.env.SESSION_SECRET ||
      "vouquet_session_secret_change_me_in_production_1234567890",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
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
