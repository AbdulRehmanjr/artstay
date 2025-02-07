import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lf74llf0l5.ufs.sh',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default config;
