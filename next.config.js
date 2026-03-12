/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
  },
  webpack: (config) => {
    config.watchOptions.ignored.push('**/__tests__/**');
    return config;
  },
};

module.exports = nextConfig;
