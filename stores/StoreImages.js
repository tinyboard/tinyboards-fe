import { defineStore } from 'pinia';

export const useImageStore = defineStore('image', {
	// State
	state: () => {
		return {
			avatar: null,
			banner: null,
			background: null,
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
		setBackground(bg) {
			this.background = bg;
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
		purgeBackground() {
			this.background = null;
		},
		purgeDefaultAvatar() {
			this.default_avatar = null;
		},
		purge() {
			this.purgeAvatar();
			this.purgeBanner();
			this.purgeBackground();
			this.purgeDefaultAvatar();
		}
	}
})