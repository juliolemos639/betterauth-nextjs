import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "607cmdif1f.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
