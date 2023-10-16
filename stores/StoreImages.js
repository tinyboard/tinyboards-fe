import { defineStore } from 'pinia';

export const useImageStore = defineStore('image', {
	// State
	state: () => {
		return {
			avatar: null,
			banner: null,
			default_avatar: null
		};
	},
	actions: {
		setAvatar(avatar) {
			this.avatar = avatar;
		},
		setBanner(banner) {
			this.banner = banner;
		},
		setDefaultAvatar(default_avatar) {
			this.default_avatar = default_avatar;
		},
		purgeAvatar() {
			this.avatar = null;
		},
		purgeBanner() {
			this.banner = null;
		},
		purgeDefaultAvatar() {
			this.default_avatar = null;
		},
		purge() {
			this.purgeAvatar();
			this.purgeBanner();
			this.purgeDefaultAvatar();
		}
	}
})