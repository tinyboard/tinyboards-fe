// https://v3.nuxtjs.org/api/configuration/nuxt.config
import { defineNuxtConfig } from "nuxt/config";

const tls = require('tls');
tls.DEFAULT_ECDH_CURVE = 'auto';

export default defineNuxtConfig({
	alias: {
    pinia: '/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs',
  },
  app: {
    head: {
      link: [
      {
        rel: "preload", href: "/_nuxt/assets/fonts/Mona-Sans.woff2", as: "font", type: "font/woff2", crossorigin: "anonymous"
      }
      ]
    }
  },
  css: ["~/assets/css/main.css"],
  modern: true,
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss"
    ],
  routeRules: {
        // Static page generated on-demand once
    '/help/**': { static: true },
    '/': { redirect: '/feed' },
        // Force server-side rendering
    '/user/**': { ssr: true },
  }
});

