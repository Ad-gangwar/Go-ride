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
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.stripe.com https://*.googleapis.com https://*.google.com;
              connect-src 'self' https://*.stripe.com https://*.googleapis.com https://*.google.com https://maps.googleapis.com;
              img-src 'self' data: https://*.stripe.com https://*.googleapis.com https://*.google.com https://*.gstatic.com https://*.ggpht.com;
              frame-src 'self' https://*.stripe.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' https://fonts.gstatic.com;
            `.replace(/\s+/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 