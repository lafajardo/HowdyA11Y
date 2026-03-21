import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/challenges",
        destination: "/",
        permanent: true,
      },
      {
        source: "/principles",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
