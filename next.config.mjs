import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root to this project — the home directory contains an
  // unrelated package-lock.json that Next would otherwise infer as the root.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
