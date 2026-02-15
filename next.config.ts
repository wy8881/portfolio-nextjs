import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['three'],
  images: {
    qualities:[75,90],
  }
};

export default nextConfig;
