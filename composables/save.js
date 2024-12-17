import { ref } from "vue";
import { useAPI } from "@/composables/api";
import { useToastStore } from '@/stores/StoreToast';

const toast = useToastStore();

export function useSave(hasSaved) {
	let isSaved = ref(hasSaved);

	const save = (id,type) => {
		isSaved.value = !isSaved.value;
		// Make the request.
		useAPI(`/${type}s/${id}/saved`, {
			method: "PATCH",
		})
		.then(({ data, error }) => {
			if (data.value) {
				// Show success toast.
				toast.addNotification({header:`${type} saved`,message:`The ${type} was saved!`,type:'success'});
			} else {
				// Revert the save.
				isSaved.value = !isSaved.value;
				// Show error toast.
				toast.addNotification({header:'Saving failed',message:`Failed to save the ${type}.`,type:'error'});
				// Log the error.
				console.error(error.value)
			}
		});
		
	};

	return {
		save,
		isSaved
	};
}