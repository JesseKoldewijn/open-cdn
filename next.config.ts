import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  rewrites: async () => [
    {
      source: "/:proto/:domain/:tld/:filepath*",
      destination: "/api/:proto/:domain/:tld/:filepath*",
    },
    {
      source: "/direct-query",
      destination: "/api/direct-query",
    },
  ],
};

export default nextConfig;
