// https://v3.nuxtjs.org/api/configuration/nuxt.config
// nuxt.config.ts
import { defineNuxtConfig } from "nuxt/config";
import dotenv from 'dotenv'

const tls = require('tls');
tls.DEFAULT_ECDH_CURVE = 'auto';

dotenv.config();

export default defineNuxtConfig({
    alias: {
        pinia: '/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs',
    },
    css: ["~/assets/css/main.css"],
    modern: true,
    modules: [
        "@pinia/nuxt",
        "@nuxtjs/tailwindcss"
    ],
    env: {
        BASE_URL: process.env.TB_URL,
    },
    routeRules: {
        // Static page generated on-demand once
        '/help/**': { static: true },
        '/': { redirect: '/feed' },
        // Force server-side rendering
        '/user/**': { ssr: true },
    }
});

