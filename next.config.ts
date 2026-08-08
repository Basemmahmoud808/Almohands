import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '192.168.1.9',
    '192.168.1.9:3000',
    '0.0.0.0',
    'localhost:3000',
  ],
};

export default nextConfig;
