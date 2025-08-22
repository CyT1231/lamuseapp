// next.config.mjs
import nextPWA from 'next-pwa';

const isProd = process.env.NODE_ENV === 'production';

// 先传 PWA 选项
const withPWA = nextPWA({
  dest: 'public',
  disable: !isProd,   // 开发环境禁用 PWA，避免噪音
  register: true,
  skipWaiting: true,
});

// 再传 Next.js 配置
export default withPWA({
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
});
