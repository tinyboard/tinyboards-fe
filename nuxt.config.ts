// https://v3.nuxtjs.org/api/configuration/nuxt.config
import { defineNuxtConfig } from "nuxt/config";
import tsconfigPaths from 'vite-tsconfig-paths';

const tls = require("tls");

const process = require("process");
tls.DEFAULT_ECDH_CURVE = "auto";

export default defineNuxtConfig({
  devtools: { enabled: true },

  // Reduce console noise
  nitro: {
    logLevel: process.env.NODE_ENV === 'development' ? 1 : 0,
  },

  // alias: {
  //   pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs",
  // },

  devServer: {
    port: 3000,
    host: "localhost",
  },

  app: {
    head: {
      link: [
        {
          rel: "preload",
          href: "/fonts/Mona-Sans.woff2",
          as: "font",
          type: "font/woff2",
          crossorigin: "anonymous",
        },
      ],
    },
  },

  css: ["~/assets/css/main.css"],
  devServerHandlers: [],
  modern: true,

  modules: [
    "@nuxtjs/tailwindcss",
    //"@nuxtjs/i18n",
    "@pinia/nuxt"
  ],

  /*pinia: {
    storesDirs: ['./stores/**']
  },*/

  //i18n: {},
  routeRules: {
    // Static pages with long cache
    "/help/**": {
      static: true,
      headers: { 'Cache-Control': 's-maxage=86400' }
    },

    // SPA for user profiles to avoid hydration mismatches with cookies
    "/@**": {
      ssr: false
    },

    // SPA for home feed to avoid hydration mismatches
    "/home/**": {
      ssr: false
    },

    // SPA for public feeds to avoid hydration mismatches
    "/feed/**": {
      ssr: false
    },
    "/all/**": {
      ssr: false
    },

    // SPA for admin interfaces (no caching, auth-required)
    "/admin/**": {
      ssr: false,
      index: false,
      headers: { 'Cache-Control': 'no-store, must-revalidate' }
    },
    "/settings/**": {
      ssr: false,
      index: false,
      headers: { 'Cache-Control': 'no-store, must-revalidate' }
    },

    // SPA for auth pages to avoid SSR redirect issues
    "/login": {
      ssr: false
    },
    "/register": {
      ssr: false
    },

    // SPA for post pages to avoid hydration mismatches with user-specific data
    "/p/**": {
      ssr: false
    },

    // SPA for board pages to avoid hydration mismatches with user-specific data
    "/b/**": {
      ssr: false
    },

    // SPA for streams to avoid hydration mismatches with user-specific data
    "/streams/**": {
      ssr: false
    },

    // Homepage redirect
    "/": {
      redirect: "/home"
    }
  },

  runtimeConfig: {
    public: {
      domain: process.env.NUXT_PUBLIC_DOMAIN || 'localhost:8536',
      use_https: process.env.NUXT_PUBLIC_USE_HTTPS === 'true',
      // Make GraphQL endpoint available to client-side
      GQL_HOST: process.env.NUXT_PUBLIC_GQL_HOST || process.env.GQL_HOST,
    },
    // Server-side only configuration
    GQL_HOST: process.env.GQL_HOST,
    NUXT_INTERNAL_GQL_HOST: process.env.NUXT_INTERNAL_GQL_HOST || 'http://tinyboards:8536/api/v2/graphql',
  },


  optimizeDeps: {
    exclude: ["@vueuse/head"],
  },

  compatibilityDate: "2024-10-06",

  vite: {
    plugins: [tsconfigPaths()],
    resolve: {
      alias: {}
    },
    server: {
      allowedHosts: ["localhost", "tinyboards.test"],
      hmr: {
        port: 3000,
        clientPort: 3000,
        host: 'localhost',
        protocol: 'ws'
      }
      // fs: {
      //   cachedChecks: false,
      // },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', '@vue/runtime-core'],
            'ui-components': ['@headlessui/vue'],
            'utils': ['date-fns', 'marked']
          }
        }
      }
    }
  },
});
