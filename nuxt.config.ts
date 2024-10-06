// https://v3.nuxtjs.org/api/configuration/nuxt.config
import { defineNuxtConfig } from "nuxt/config";

const tls = require("tls");
tls.DEFAULT_ECDH_CURVE = "auto";

export default defineNuxtConfig({
  alias: {
    pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs",
  },

  devServer: {
    port: 3000,
    host: "tinyboards.test",
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
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/apollo",
    //"@nuxtjs/i18n",
  ],

  //i18n: {},
  routeRules: {
    // Static page generated on-demand once
    "/help/**": { static: true },
    "/": { redirect: "/feed" },
    // Force server-side rendering
    "/user/**": { ssr: true },
  },

  apollo: {
    clients: {
      default: {
        httpEndpoint: "http://localhost/api/v2/graphql",
      },
    },
  },

  runtimeConfig: {
    public: {
      domain: "",
      use_https: true,
    },
  },

  optimizeDeps: {
    exclude: ["@vueuse/head"],
  },

  compatibilityDate: "2024-10-06",

  vite: {
    server: {
      fs: {
        cachedChecks: false,
      },
    },
  },
});
