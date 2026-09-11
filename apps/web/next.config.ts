import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@oss/contracts", "@oss/core", "@oss/db", "@oss/renderer", "@oss/storage"],
  experimental: { externalDir: true, useTypeScriptCli: false },
  serverExternalPackages: ["sharp", "pg", "better-auth"],
  poweredByHeader: false
};

export default nextConfig;
