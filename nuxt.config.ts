import Aura from "@primevue/themes/aura";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  experimental: { typedPages: true },
  // Enable nuxt 4 file structure
  future: {
    compatibilityVersion: 4,
  },
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  // Configure server sessions
  runtimeConfig: {
    session: {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      cookie: {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      },
    },
  },
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    }
  },
  // Local DB
  $development: {
    nitro: {
      storage: {
        ["mongo:todos"]: {
          driver: "fs",
          base: "./db/todos",
        },
        ["mongo:auth"]: {
          driver: "fs",
          base: "./db/auth",
        },
      },
    },
  },
  // MongoDB Atlas for production
  $production: {
    nitro: {
      storage: {
        ["mongo:todos"]: {
          driver: "mongodb",
          connectionString: process.env.MONGODB_URI,
          collectionName: "todos",
          databaseName: "nuxt_todo",
        },
        ["mongo:auth"]: {
          driver: "mongodb",
          connectionString: process.env.MONGODB_URI,
          collectionName: "auth",
          databaseName: "nuxt_todo",
        },
      },
    },
  },
  // Allow security module to work with Nuxt Devtools
  security: {
    headers: {
      crossOriginEmbedderPolicy:
        process.env.NODE_ENV === "development" ? "unsafe-none" : "require-corp",
    },
  },
  // PrimeVue theme
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
  },
  modules: [
    "nuxt-auth-utils",
    "@pinia/nuxt",
    "@nuxt/eslint",
    "@primevue/nuxt-module",
    "@nuxtjs/tailwindcss",
    "nuxt-security",
  ],
});
