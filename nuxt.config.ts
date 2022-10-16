// https://v3.nuxtjs.org/api/configuration/nuxt.config
import { defineNuxtConfig } from "nuxt";

export default defineNuxtConfig({
	alias: {
        pinia: '/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs',
    },
	css: ["~/assets/css/main.css"],
	modules: [
		"@pinia/nuxt",
    	"@nuxtjs/tailwindcss"
  	]
})
