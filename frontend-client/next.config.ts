import type { NextConfig } from "next";

const baseConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      },{
        hostname:'localhost',
        protocol:'http',
        port:'8080',
        pathname:'**'
      },
      {
        hostname:'example.com',
        protocol:'https',
        pathname:'**'
      },{
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: ''
      },{
        protocol: 'http',
        hostname: 'lorempixel.com',
        port: ''
      }
    ]
  },
  transpilePackages: ['geist']
};

export default baseConfig;
