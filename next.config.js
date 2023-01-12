/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [{ hostname: "vestibulares2022.com.br" }],
  },
};

module.exports = nextConfig;
