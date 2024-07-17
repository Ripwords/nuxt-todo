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
  security: {
    headers: {
      crossOriginEmbedderPolicy: process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp',
    },
  },
  runtimeConfig: {
    mongoDB: import.meta.env.MONGODB_URI,
    session: {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      }
    }
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
    "@nuxtjs/tailwindcss",
    "nuxt-security"
  ]
})