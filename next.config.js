/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
  },
  webpack: (config) => {
    // Safely add to the ignored list, whether it's a string or an array
    const ignored = Array.isArray(config.watchOptions.ignored)
      ? config.watchOptions.ignored
      : [config.watchOptions.ignored].filter(Boolean);

    config.watchOptions.ignored = [...ignored, '**/__tests__/**'];
    return config;
  },
};

module.exports = nextConfig;
