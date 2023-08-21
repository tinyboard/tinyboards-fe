import { defineStore } from 'pinia';

export const useImageStore = defineStore('image', {
	// State
	state: () => {
		return {
			avatar: null,
			banner: null
		};
	},
	actions: {
		setAvatar(avatar) {
			this.avatar = avatar;
		},
		setBanner(banner) {
			this.banner = banner;
		},
		purgeAvatar() {
			this.avatar = null;
		},
		purgeBanner() {
			this.banner = null;
		},
		purge() {
			this.purgeAvatar();
			this.purgeBanner();
		}
	}
})