import { ref } from "vue";

export function useSave(hasSaved) {
	let isSaved = ref(hasSaved);

	function save() {
		isSaved.value = !isSaved.value
	}

	return {
		save,
		isSaved
	};
}