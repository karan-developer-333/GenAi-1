import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@xenova/transformers', 'sharp'],
  turbopack: {
    resolveAlias: {
      'onnxruntime-node': './shims/onnxruntime-node.js',
    },
  },
};

export default nextConfig;
