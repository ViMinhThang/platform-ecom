import type { NextConfig } from "next";

const baseConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.slingacademy.com",
        port: "",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "**",
      },
      {
        hostname: "localhost",
        protocol: "http",
        port: "8080",
        pathname: "**",
      },
      {
        hostname: "example.com",
        protocol: "https",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        protocol: "http",
        hostname: "lorempixel.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  transpilePackages: ["geist"],
};

export default baseConfig;
