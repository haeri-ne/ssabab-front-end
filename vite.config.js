import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'SSABAB',
        short_name: 'SSABAB',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#42b883',
        icons: [
          {
            src: '/src/assets/ssabab-icon.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/src/assets/ssabab-icon.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      }
    })
  ],
  base: '/',
})
