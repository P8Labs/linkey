import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  allowedDevOrigins: ["*.local"],
  async rewrites() {
    return {
      afterFiles: [
        {
          source: "/:shorten",
          destination: "/api/v1/r/:shorten",
        },
      ],
    };
  },
};

export default nextConfig;
