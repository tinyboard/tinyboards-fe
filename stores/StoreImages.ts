import { defineStore } from 'pinia';

interface ImageStore {
	avatar: string | null;
	banner: string | null;
	background: string | null;
	default_avatar: string | null;
	emoji: string | null;
}

export const useImageStore = defineStore('image', {
	// State
	state: (): ImageStore => {
		return {
			avatar: null,
			banner: null,
			background: null,
			default_avatar: null,
			emoji: null
		};
	},
	actions: {
		setAvatar(avatar: string) {
			this.avatar = avatar;
		},
		setBanner(banner: string) {
			this.banner = banner;
		},
		setBackground(bg: string) {
			this.background = bg;
		},
		setDefaultAvatar(default_avatar: string) {
			this.default_avatar = default_avatar;
		},
		setEmoji(emoji: string) {
			this.emoji = emoji;
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
		purgeEmoji() {
			this.emoji = null;
		},
		purge() {
			this.purgeAvatar();
			this.purgeBanner();
			this.purgeBackground();
			this.purgeDefaultAvatar();
			this.purgeEmoji();
		}
	}
})