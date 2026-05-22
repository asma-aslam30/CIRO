/** @type {import('next').NextConfig} */
// Deployment trigger - v1.0.0
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
};

export default nextConfig;
