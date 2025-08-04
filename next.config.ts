import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Базовая конфигурация для GitHub Pages
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",

  // Настройки для оптимизации изображений
  images: {
    domains: ["your-image-domain.com"], // Добавьте ваши домены
    loader: "default",
    path: "/_next/image",
  },

  // Настройки для SSR и SSG
  future: {
    webpack5: true,
  },

  // Перезаписи URL для корректной работы на GitHub Pages
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/index.html",
      },
    ];
  },

  output: "export",
  // Другие полезные настройки
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  webpack(config) {
    // Здесь можно добавить кастомную конфигурацию webpack
    return config;
  },
};

export default nextConfig;
