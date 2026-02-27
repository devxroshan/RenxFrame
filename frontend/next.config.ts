import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["renxframe.test", "*.renxframe.test"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
