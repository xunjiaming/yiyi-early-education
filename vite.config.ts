import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        id: './',
        name: '伊伊早教工作台',
        short_name: '伊伊早教',
        description: '0-3 岁月龄自适应早教工具',
        lang: 'zh-CN',
        dir: 'ltr',
        theme_color: '#ffffff',
        background_color: '#f7f5f1',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        orientation: 'portrait',
        start_url: './',
        scope: './',
        categories: ['education', 'kids'],
        prefer_related_applications: false,
        icons: [
          { src: './icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: './icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ],
  server: {
    host: true,
    port: 5173
  }
})
