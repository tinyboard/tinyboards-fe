import { defineStore } from "pinia";
import { useApi } from "@/composables/api";

export const useBoardStore = defineStore("board", {
	state: () => {
		return {
			boardView: {},
			mods: [],
			modPermissions: 0,
			boardActive: false
		}
	},
	actions :{
		async load({ name }) {
			const { data, pending, error, refresh } = await useApi("/boards/get", {
			    query: {
			    	name
			    },
			    key: "name",
			});
			
			if (data.value) {
				this.boardView = data.value["board_view"];
				this.mods = data.value["moderators"];
				this.modPermissions = this.boardView.mod_permissions;
				this.boardActive = true;
			} else {
				console.log(`getting board +${name} failed: ${error.value}`);
				this.clear();

				throw createError({
				  statusCode: 404,
				  statusMessage: `It appears that +${name} doesn't exist. Awkward...`,
				  fatal: true,
				});
			}
		},
		clear() {
			this.boardView = {};
			this.mods = [];
			this.boardActive = false;
			this.modPermissions = null;
		}
	}
});
