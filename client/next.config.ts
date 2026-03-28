import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins:["10.38.214.34"],
  serverExternalPackages: ['@xenova/transformers', 'onnxruntime-node', 'sharp'],
};

export default nextConfig;
