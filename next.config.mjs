/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  output: 'standalone',
  experimental: {
    forceSwcTransforms: false
  }
}

export default nextConfig