/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.stripe.com;
              connect-src 'self' https://*.stripe.com;
              img-src 'self' data: https://*.stripe.com;
              frame-src 'self' https://*.stripe.com;
              style-src 'self' 'unsafe-inline';
              font-src 'self';
            `.replace(/\s+/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 