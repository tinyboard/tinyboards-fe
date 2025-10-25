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
          href: "/_nuxt/assets/fonts/Mona-Sans.woff2",
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

    // SPA for user profiles (avoid SSR caching issues with dynamic user content)
    "/@**": {
      ssr: false,
      headers: { 'Cache-Control': 'no-store' }
    },

    // SPA for feeds (user-specific content, auth-dependent)
    "/home/**": {
      ssr: false,
      headers: { 'Cache-Control': 'no-store' }
    },
    "/feed/**": {
      ssr: false,
      headers: { 'Cache-Control': 'no-store' }
    },
    "/all/**": {
      ssr: false,
      headers: { 'Cache-Control': 'no-store' }
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

    // CRITICAL: Enable SSR for post pages (SEO, social sharing, link previews)
    "/p/**": {
      ssr: true,
      headers: { 'Cache-Control': 's-maxage=600, stale-while-revalidate=3600' }
    },

    // CRITICAL: Enable SSR for board pages (SEO, discovery)
    "/b/**": {
      ssr: true,
      headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=1800' }
    },

    // SPA for streams (avoid SSR auth context issues)
    "/streams/**": {
      ssr: false,
      headers: { 'Cache-Control': 'no-store' }
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
