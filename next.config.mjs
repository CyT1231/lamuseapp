// next.config.mjs
import nextPWA from 'next-pwa';

const isProd = process.env.NODE_ENV === 'production';
const withPWA = nextPWA({
  dest: 'public',
  disable: !isProd,
  register: true,
  skipWaiting: true,
});

export default withPWA({
  reactStrictMode: true,
  // experimental: { typedRoutes: true }, // ❌ remove or set false
});
