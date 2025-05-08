import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image-dad-storage.bytespark.app",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8787",
      },
    ],
  },
};

export default nextConfig;
