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
        name: '之之早教工作台',
        short_name: '早教台',
        description: '0-3 岁月龄自适应早教工具',
        theme_color: '#ffffff',
        background_color: '#f7f5f1',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          { src: './icon-192.png', sizes: '192x192', type: 'image/png' },
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
