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
      name: "page",
      mode: "out-in",
    },
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
  site: {
    url: "https://ripwords-nuxt-todo.vercel.app",
    name: "Nuxt Todo",
    description: "Nuxt Todo with authentication and data encryption!",
    defaultLocale: "en", // not needed if you have @nuxtjs/i18n installed
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
  pwa: {
    devOptions: {
      // enabled: true,
      suppressWarnings: true,
    },
    pwaAssets: {
      config: true,
    },
    manifest: {
      background_color: "#121212",
      theme_color: "#121212",
      description: "A Nuxt.js Todo App with authentication and data encryption",
      name: "Nuxt Todo",
      short_name: "Nuxt Todo",
    },
  },
  modules: [
    "nuxt-auth-utils",
    "@pinia/nuxt",
    "@nuxt/eslint",
    "@primevue/nuxt-module",
    "@nuxtjs/tailwindcss",
    "nuxt-security",
    "@vueuse/nuxt",
    "@vite-pwa/nuxt",
    "@nuxtjs/seo",
  ],
});
