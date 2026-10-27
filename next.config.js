/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Same URL style as the old site: /cardiology-devices/
  trailingSlash: true,
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/gastroenterology-devices.html', destination: '/gastroenterology-devices/', permanent: true },
      { source: '/cardiology-devices.html', destination: '/cardiology-devices/', permanent: true },
      { source: '/vascular-devices.html', destination: '/vascular-devices/', permanent: true },
      { source: '/urology-devices.html', destination: '/urology-devices/', permanent: true },
      { source: '/gallery.html', destination: '/gallery/', permanent: true },
      { source: '/contact.html', destination: '/contact/', permanent: true },
    ];
  },
};
module.exports = nextConfig;
