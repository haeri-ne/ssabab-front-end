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
        display: 'fullscreen',
        background_color: '#ffffff',
        theme_color: '#2b9fed',
        icons: [
          {
            src: 'https://ssabab.com/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'https://ssabab.com/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ]        
      }
    })
    
  ],
  base: '/',
})
