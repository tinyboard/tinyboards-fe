import { LiteYTEmbed as liteYoutube } from '@justinribeiro/lite-youtube';

export default defineNuxtPlugin(nuxtApp =>{
	return {
		provide: {
			liteYoutube
		}
	}
});