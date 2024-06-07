import { defineStore } from "pinia";
import { useApi } from "@/composables/api";

export const useBoardStore = defineStore("board", {
	state: () => {
		return {
			boardView: {},
			mods: [],
			boardActive: false
		}
	},
	actions :{
		async load({ name }) {
			const { data, pending, error, refresh } = await useApi("/board", {
			    query: {
			    	name
			    },
			    key: "name",
			});
			
			if (data.value) {
				this.boardView = data.value["board_view"];
				this.mods = data.value["moderators"];
				this.boardActive = true;
			} else {
				console.log(`getting board +${name} failed: ${error.value}`);
				this.clear();
			}
		},
		clear() {
			this.boardView = {};
			this.mods = [];
			this.boardActive = false;
		}
	}
});
