import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, ".."),
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
