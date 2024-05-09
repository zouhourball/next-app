/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'deadline.com',
            pathname: '/wp-content/uploads/**',
          },
          {
            protocol: 'https',
            hostname: 'images.pushsquare.com',
          },
          {
            protocol: 'https',
            hostname: 'www.tampabay.com',
          },
          {
            protocol: 'https',
            hostname: 'assets1.cbsnewsstatic.com',
          },
          {
            protocol: 'https',
            hostname: 'media.npr.org',
          },
          {
            protocol: 'https',
            hostname: 'ewscripps.brightspotcdn.com',
          },
        ],
      },
}

module.exports = nextConfig
