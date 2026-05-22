/** @type {import('next').NextConfig} */
// Deployment v2.2.0 - Fixed backend URL
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
};

export default nextConfig;
