import Aura from '@primevue/themes/aura';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { 
    enabled: true, 
    timeline: { 
      enabled: true 
    } 
  },
  runtimeConfig: {
    mongoDB: import.meta.env.MONGODB_URI
  },
  experimental: { typedPages: true },
  future: {
    compatibilityVersion: 4,
  },
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  },
  modules: [
    "nuxt-auth-utils",
    "@pinia/nuxt",
    "@nuxt/eslint",
    "@primevue/nuxt-module",
    "@nuxtjs/tailwindcss"
  ]
})