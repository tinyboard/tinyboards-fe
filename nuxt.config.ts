// https://v3.nuxtjs.org/api/configuration/nuxt.config
import { defineNuxtConfig } from "nuxt/config";

const tls = require('tls');
tls.DEFAULT_ECDH_CURVE = 'auto';

export default defineNuxtConfig({
	// Pinia alias removed - using default Pinia setup
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
  },
  runtimeConfig: {
    public: {
      domain: process.env.NUXT_PUBLIC_DOMAIN || 'localhost:8080',
      use_https: process.env.NUXT_PUBLIC_USE_HTTPS === 'true' || false
    }
  },
  optimizeDeps: {
    exclude: ['@vueuse/head']
  }
});

