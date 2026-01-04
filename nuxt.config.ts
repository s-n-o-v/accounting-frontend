// nuxt.config.ts
import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/devtools',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@primevue/nuxt-module'
  ],

  compatibilityDate: '2024-11-01',

  typescript: {
    strict: true
  },

  // ВАЖНО: Обновляем пути к CSS
  css: [
    'primeicons/primeicons.css',
    '~/assets/css/main.scss',
  ],

  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: '.dark',
          cssLayer: false,
        },
      }
    }
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
      appName: 'Accounting Service'
    }
  },
  
  devtools: {
    enabled: true
  }
})