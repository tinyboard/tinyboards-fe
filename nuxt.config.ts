// https://v3.nuxtjs.org/api/configuration/nuxt.config
import { defineNuxtConfig } from "nuxt/config";
import tsconfigPaths from 'vite-tsconfig-paths';

const tls = require("tls");

// this is to read env vars to set the base url for graphql requests
const process = require("process");
tls.DEFAULT_ECDH_CURVE = "auto";

export default defineNuxtConfig({
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

  modules: ["@nuxtjs/tailwindcss", //"@nuxtjs/i18n",
    "nuxt-graphql-client", "@pinia/nuxt"],

  /*pinia: {
    storesDirs: ['./stores/**']
  },*/

  //i18n: {},
  routeRules: {
    // Static prerendered pages
    "/help/**": {
      static: true,
      prerender: true,
      headers: { 'Cache-Control': 's-maxage=86400' }
    },

    // SSR with caching for user profiles
    "/@**": {
      ssr: true,
      headers: { 'Cache-Control': 's-maxage=300' }
    },

    // Hybrid rendering for feeds
    "/feed/**": {
      ssr: true,
      experimentalNoScripts: true // Remove hydration overhead
    },

    // SPA for admin interfaces
    "/admin/**": {
      ssr: false,
      index: false
    },
    "/settings/**": {
      ssr: false,
      index: false
    },

    // Board pages with SSR for SEO
    "/+**": {
      ssr: true,
      headers: { 'Cache-Control': 's-maxage=300' }
    },

    // Static homepage redirect
    "/": {
      redirect: "/feed",
      prerender: true
    }
  },

  runtimeConfig: {
    public: {
      domain: "",
      use_https: true,
      GQL_HOST: `${process.env.NUXT_PUBLIC_USE_HTTPS === "true" ? "https" : "http"}://${process.env.NUXT_PUBLIC_DOMAIN}/api/v2/graphql`,
    },
  },

  'graphql-client': {
    schema: `${process.env.NUXT_PUBLIC_USE_HTTPS === "true" ? "https" : "http"}://${process.env.NUXT_PUBLIC_DOMAIN}/api/v2/graphql`,
    tokenStorage: {
      name: 'token',
      mode: 'cookie'
    }
  },

  /*apollo: {
    clients: {
      default: {
        httpEndpoint: `${process.env.NUXT_PUBLIC_USE_HTTPS === "true" ? "https" : "http"}://${process.env.NUXT_PUBLIC_DOMAIN}/api/v2/graphql`,
        tokenName: "token",
      },
    },
  },*/

  optimizeDeps: {
    exclude: ["@vueuse/head"],
  },

  compatibilityDate: "2024-10-06",

  vite: {
    plugins: [tsconfigPaths()],
    server: {
      allowedHosts: ["localhost"],
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
