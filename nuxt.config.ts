// https://v3.nuxtjs.org/api/configuration/nuxt.config
import { defineNuxtConfig } from "nuxt/config";

const tls = require("tls");

// this is to read env vars to set the base url for graphql requests
const process = require("process");
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

  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss", //"@nuxtjs/i18n",
  "nuxt-graphql-client"],

  //i18n: {},
  routeRules: {
    // Static page generated on-demand once
    "/help/**": { static: true },
    "/": { redirect: "/feed" },
    // Force server-side rendering
    "/user/**": { ssr: true },
  },

  runtimeConfig: {
    public: {
      domain: "",
      use_https: true,
      GQL_HOST: `${process.env.NUXT_PUBLIC_USE_HTTPS === "true" ? "https" : "http"}://${process.env.NUXT_PUBLIC_DOMAIN}/api/v2/graphql`,
    },
  },

  'graphql-client': {
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
    server: {
    allowedHosts: ["tinyboards.test"],
      fs: {
        cachedChecks: false,
      },
    },
  },
});
